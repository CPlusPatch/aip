// eslint-disable-next-line import/no-named-as-default
import { nanoid } from "nanoid";
import OpenAI from "openai";
import { AppDataSource } from "~/db/data-source";
import { Chat } from "~/db/entities/Chat";
import { getConfig } from "~/utils/config";
import { getUserByToken } from "~/utils/tokens";

export default defineEventHandler(async event => {
	const user = await getUserByToken(
		event.node.req.headers.authorization?.split(" ")[1] ?? ""
	);

	// Throw an error if the sender is not authorized.
	if (!user) {
		throw createError({
			statusCode: 401,
		});
	}

	event.node.res.writeHead(200, { "Content-Type": "text/plain" });

	const messages = await readBody<{ role: "user" | "system"; content: string; id: string }[]>(event);

	// Get relevant chat from database and update messages
	const chatId = event.context.params?.id ?? "";

	const chat = await AppDataSource.getRepository(Chat).findOne({
		where: {
			id: Number(chatId),
			user: {
				id: user.id,
			}
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

	chat.messages = messages;

	await AppDataSource.getRepository(Chat).save(chat);

	const config = getConfig();

	const openai = new OpenAI({
		apiKey: "",
		baseURL: `${config.ai.base_url}/v1`,
	});

	let newMessage = "";

	const stream = await openai.chat.completions.create({
		messages: messages as any,
		model: config.ai.model,
		stream: true,
		max_tokens: 4096,
	});

	for await (const part of stream) {
		event.node.res.write(part.choices[0]?.delta?.content || "");
		newMessage += part.choices[0]?.delta?.content || "";
	}

	event.node.res.end();

	chat.messages = [
		...chat.messages,
		{
			role: "system",
			content: newMessage,
			id: nanoid(),
		},
	];

	await AppDataSource.getRepository(Chat).save(chat);
});
