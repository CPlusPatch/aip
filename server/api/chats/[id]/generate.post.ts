import { nanoid } from "nanoid";
// eslint-disable-next-line import/no-named-as-default
import OpenAI from "openai";
import type { Stream } from "openai/streaming";
import { Subscriptions } from "~/db/entities/User";
import { Chat } from "~/db/entities/Chat";
import { Workers } from "~/utils/workers";
import { getUserAndErrorIfNone } from "~/server/utils/authMiddleware";

export default defineEventHandler(async event => {
	const user = await getUserAndErrorIfNone(event);

	if (
		![Subscriptions.PREMIUM].includes(user.subscription) &&
		user.credits <= 0
	) {
		throw createError({
			statusCode: 402,
			message: "Insufficient credits",
		});
	}

	const body = await readBody<{
		messages: {
			role: "user" | "system" | "assistant";
			content: string;
			id: string;
			date: number;
		}[];
		temperature?: number;
	}>(event);

	// Get relevant chat from database and update messages
	const chatId = event.context.params?.id ?? "";

	const chat = await Chat.findOne({
		where: {
			id: chatId,
			user: {
				id: user.id,
			},
		},
		relations: {
			user: true,
		},
	});

	if (!chat) {
		throw createError({
			statusCode: 404,
			message: "Chat not found",
		});
	}

	// Fetch file from /tmp/aip-workers.json and read contents
	let workers = new Workers();

	let workerIndex = workers.findNextavailable(chat.model);

	if (workerIndex === -1) {
		throw createError({
			statusCode: 503,
			message: "No available workers. Please choose a different model.",
		});
	}
	event.node.res.writeHead(200, { "Content-Type": "text/plain" });

	try {
		chat.messages = body.messages;

		await chat.save();

		// Set worker as occupied and save changes to disk
		workers.workers[workerIndex].occupied = true;
		workers.writeChanges();

		let newMessage = "";
		let stream: Stream<OpenAI.Chat.Completions.ChatCompletionChunk>;

		while (true) {
			try {
				const openai = new OpenAI({
					apiKey: "",
					baseURL: `${workers.workers[workerIndex].address}/v1`,
					timeout: 10000,
					maxRetries: 1,
					fetch,
				});

				console.log("Generating answer...");

				// If this throws an error, the worker is marked as offline and the next available worker is used
				stream = await openai.chat.completions.create({
					messages: body.messages as any,
					model: chat.model,
					stream: true,
					temperature: body.temperature ?? 0.7,
					max_tokens: 4096,
					frequency_penalty: 1.7,
				});

				break;
			} catch (e) {
				console.error(e);
				// Cycle to next available worker, mark this one as offline
				workers.workers[workerIndex].noRetryUntil =
					Date.now() + 60 * 60 * 10;
				workers.workers[workerIndex].occupied = false;
				workers.writeChanges();
				workerIndex = workers.findNextavailable(chat.model);

				if (workerIndex === -1) {
					throw createError({
						statusCode: 503,
						message:
							"No available workers. Please choose a different model.",
					});
				}
			}
		}

		for await (const part of stream) {
			const chunk = part.choices[0]?.delta?.content || "";
			event.node.res.write(chunk);
			newMessage += chunk;

			if (event.node.res.closed) {
				event.node.res.end();
				break;
			}

			if (![Subscriptions.PREMIUM].includes(user.subscription)) {
				user.credits -= chunk.length;
			}

			if (
				![Subscriptions.PREMIUM].includes(user.subscription) &&
				user.credits <= 0
			) {
				user.credits = 0;
				throw createError({
					statusCode: 402,
					message: "Insufficient credits",
				});
			}
		}

		event.node.res.end();

		chat.messages.push({
			role: "assistant",
			content: newMessage,
			id: nanoid(),
			date: Date.now(),
		});

		await chat.save();
	} catch (e) {
		console.error(e);
	} finally {
		// Get new changes
		workers = new Workers();

		await user.save();

		// Set worker as unoccupied and save changes to disk
		workers.workers[workerIndex].occupied = false;
		workers.writeChanges();
	}
});
