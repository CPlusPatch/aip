import DOMPurify from "isomorphic-dompurify";
import { getUserByToken } from "~/utils/tokens";
import { Chat } from "~/db/entities/Chat";
import { models } from "~/utils/models";

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
			id: Number(event.context.params?.id) ?? 0,
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

	let body = await readBody<Partial<Chat>>(event);

	// Use DOMPurify on every body attribute
	body = Object.fromEntries(
		Object.entries(body).map(([key, value]) => [
			key,
			typeof value === "string" ? DOMPurify.sanitize(value) : value,
		])
	);

	// Dont allow changing messages or endpoint or user via this endpoint
	delete body.messages;
	delete body.id;
	delete body.user;

	// Check if model is valid
	if (body.model && !models.find(model => model.model === body.model)) {
		throw createError({
			statusCode: 400,
			message: "Invalid model",
		});
	}

	// Check if model is accessible to the user's subscription level
	if (
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
		// @ts-ignore
		chat[key] = value;
	});

	chat.save();

	return true;
});
