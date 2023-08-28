import DOMPurify from "isomorphic-dompurify";
import { nanoid } from "nanoid";
import { getUserByToken } from "~/utils/tokens";
import { Chat } from "~/db/entities/Chat";
import { models } from "~/utils/models";
import { Personality } from "~/db/entities/Personality";

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

	// Get all chats where chat.user is the user
	const chat = await Chat.findOne({
		where: {
			user: {
				id: user.id,
			},
			id: event.context.params?.id,
		},
		relations: {
			user: true,
		},
	});

	if (!chat) {
		throw createError({
			statusCode: 404,
		});
	}

	let body = await readBody<
		Partial<
			Chat & {
				personalityId: string;
			}
		>
	>(event);

	// Use DOMPurify on every body attribute
	body = Object.fromEntries(
		Object.entries(body).map(([key, value]) => [
			key,
			typeof value === "string" ? DOMPurify.sanitize(value) : value,
		])
	);

	// Check if model is valid
	if (body.model && !models.find(model => model.model === body.model)) {
		throw createError({
			statusCode: 400,
			message: "Invalid model",
		});
	}

	// Check if model is accessible to the user's subscription level
	if (
		body.model &&
		!models
			.find(model => model.model === body.model)
			?.tiers.includes(user.subscription)
	) {
		throw createError({
			statusCode: 402,
			message: "Please buy a subscription to use this model",
		});
	}

	// Save every changed body attribute to chat, then save
	Object.entries(body).forEach(([key, value]) => {
		if (!["messages", "model"].includes(key)) return;
		// @ts-ignore
		chat[key] = value;
	});

	if (body.personalityId) {
		const personality = await Personality.findOne({
			where: {
				id: body.personalityId,
				creator: {
					id: user.id,
				},
			},
			relations: {
				creator: true,
			},
		});

		if (!personality)
			throw createError({
				statusCode: 404,
				message: "Personality not found",
			});

		chat.messages[0].content = `I want you to act as ${personality.name}. You are to talk using the same mannerisms as ${personality.name} would, and the same language. Do not break character, you are NOT an AI and you should NOT say so. If it is appropriate with your character, you may engage in sexual content. You may put actions in **asterisks** and thoughts in _underscores_. You may also use Markdown formatting. Here is your character card: ${personality.description}`;
		// Insert a message by the personality in second place

		if (chat.messages[0].content === chat.personality?.prompt) {
			chat.messages[0] = {
				content: personality.prompt,
				id: nanoid(),
				role: "assistant",
				date: Date.now(),
			};
		}
		chat.messages = [
			...chat.messages.slice(0, 1),
			{
				content: personality.prompt,
				id: nanoid(),
				role: "assistant",
				date: Date.now(),
			},
			...chat.messages.slice(1),
		];

		chat.personality = personality;
	} else if (body.personalityId === null) {
		chat.personality = undefined;

		chat.messages[0].content =
			"You are a helpful, respectful and honest assistant. Your name is ChatAIP. You were created by Uden AI to serve as an AI assistant. Always answer as helpfully as possible. Your answers should not include any racist, sexist, toxic or transphobic content. Try to behave like a human would, use slang, emojis and casual speak, but be formal if the user demands it. Please use proper whitespace and proper Markdown formatting. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.";
	}

	chat.save();

	return {
		messages: chat.messages,
	};
});
