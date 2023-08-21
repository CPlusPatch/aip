import { readFileSync, writeFileSync } from "fs";
import { nanoid } from "nanoid";
// eslint-disable-next-line import/no-named-as-default
import OpenAI from "openai";
import { Subscriptions } from "~/db/entities/User";
import { Chat } from "~/db/entities/Chat";
import { getWorkerConfig } from "~/utils/config";
import { getUserByToken } from "~/utils/tokens";

type Merge<A, B> = {
	[K in keyof A | keyof B]: K extends keyof A & keyof B
		? A[K] | B[K]
		: K extends keyof B
		? B[K]
		: K extends keyof A
		? A[K]
		: never;
};

export default defineEventHandler(async event => {
	// const config = getConfig();
	const workerConfig = getWorkerConfig();

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

	// Fetch file from /tmp/aip-workers.json and read contents
	let workers: Merge<
		(typeof workerConfig.workers)[0],
		{
			occupied: boolean;
		}
	>[] = [];

	try {
		workers = JSON.parse(
			await readFileSync("/tmp/aip-workers.json", "utf-8")
		);
	} catch (e) {
		workers = workerConfig.workers.map(model => ({
			...model,
			occupied: false,
		}));
	}

	const nextAvailableWorkerIndex = workers.findIndex(
		worker => !worker.occupied && worker.model === chat.model
	);

	if (nextAvailableWorkerIndex === -1) {
		throw createError({
			statusCode: 503,
			message: "No available workers. Please choose a different model.",
		});
	}

	try {
		event.node.res.writeHead(200, { "Content-Type": "text/plain" });

		chat.messages = body.messages;

		await chat.save();

		// Set worker as occupied and save changes to disk
		workers[nextAvailableWorkerIndex].occupied = true;
		await writeFileSync("/tmp/aip-workers.json", JSON.stringify(workers));

		const worker = workerConfig.workers.find(
			m => m.id === workers[nextAvailableWorkerIndex].id
		);

		const openai = new OpenAI({
			apiKey: "",
			baseURL: `${worker?.address}/v1`,
		});

		let newMessage = "";

		const stream = await openai.chat.completions.create({
			messages: body.messages as any,
			model: chat.model,
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
	} catch (e) {
		console.error(e);
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
