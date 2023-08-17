import { readFileSync, writeFileSync } from "fs";
import { nanoid } from "nanoid";
// eslint-disable-next-line import/no-named-as-default
import OpenAI from "openai";
import { Subscriptions } from "~/db/entities/User";
import { Chat } from "~/db/entities/Chat";
import { getConfig } from "~/utils/config";
import { getUserByToken } from "~/utils/tokens";

export default defineEventHandler(async event => {
	const config = getConfig();

	const user = await getUserByToken(
		event.node.req.headers.authorization?.split(" ")[1] ?? ""
	);

	// Throw an error if the sender is not authorized.
	if (!user) {
		throw createError({
			statusCode: 401,
		});
	}

	if (
		![Subscriptions.PREMIUM].includes(user.subscription) &&
		user.credits <= 0
	) {
		throw createError({
			statusCode: 402,
			message: "Insufficient credits",
		});
	}

	// Fetch file from /tmp/aip-workers.json and read contents
	let workers: {
		id: string;
		occupied: boolean;
	}[] = [];

	try {
		workers = JSON.parse(
			await readFileSync("/tmp/aip-workers.json", "utf-8")
		);
	} catch (e) {
		workers = config.ai.models.map(model => ({
			id: model.id,
			occupied: false,
		}));
	}

	const nextAvailableWorkerIndex = workers.findIndex(
		worker => !worker.occupied
	);

	try {
		event.node.res.writeHead(200, { "Content-Type": "text/plain" });

		const body = await readBody<{
			messages: {
				role: "user" | "system" | "assistant";
				content: string;
				id: string;
			}[];
			temperature?: number;
		}>(event);

		// Get relevant chat from database and update messages
		const chatId = event.context.params?.id ?? "";

		const chat = await Chat.findOne({
			where: {
				id: Number(chatId),
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

		chat.messages = body.messages;

		await chat.save();

		// Set worker as occupied and save changes to disk
		workers[nextAvailableWorkerIndex].occupied = true;
		await writeFileSync("/tmp/aip-workers.json", JSON.stringify(workers));

		const worker = config.ai.models.find(
			m => m.id === workers[nextAvailableWorkerIndex].id
		);

		const openai = new OpenAI({
			apiKey: "",
			baseURL: `${config.ai.base_url}:${worker?.port ?? 0}/v1`,
		});

		let newMessage = "";

		const stream = await openai.chat.completions.create({
			messages: body.messages as any,
			model: config.ai.model,
			stream: true,
			temperature: body.temperature ?? 0.7,
			max_tokens: 4096,
		});

		for await (const part of stream) {
			const chunk = part.choices[0]?.delta?.content || "";
			event.node.res.write(chunk);
			newMessage += chunk;
			if ([Subscriptions.PREMIUM].includes(user.subscription)) {
				// Do nothing
			} else {
				user.credits -= chunk.length;
			}

			if (user.credits < 0) {
				user.credits = 0;
				throw createError({
					statusCode: 402,
					message: "Insufficient credits",
				});
			}
		}

		event.node.res.end();

		chat.messages = [
			...chat.messages,
			{
				role: "assistant",
				content: newMessage,
				id: nanoid(),
			},
		];

		await chat.save();
	} finally {
		// Get new changes
		workers = JSON.parse(
			await readFileSync("/tmp/aip-workers.json", "utf-8")
		);

		await user.save();

		// Set worker as unoccupied and save changes to disk
		workers[nextAvailableWorkerIndex].occupied = false;
		await writeFileSync("/tmp/aip-workers.json", JSON.stringify(workers));
	}
});
