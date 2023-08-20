import { nanoid } from "nanoid";
import { Personality } from "~/db/entities/Personality";
import { Chat } from "~/db/entities/Chat";
import { getUserByToken } from "~/utils/tokens";

// Creates a new AI chat and stores it in the database
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

	const body = await readBody<{
		model: string;
		personalityId?: number;
	}>(event);

	// Validate body model
	if (!body.model) {
		throw createError({
			statusCode: 400,
			message: "Missing model",
		});
	}

	const chat = new Chat();

	chat.title = "New chat";
	if (body.personalityId) {
		chat.personality =
			(await Personality.findOneBy({
				id: body.personalityId,
			})) ?? undefined;
	}

	chat.model = body.model;

	const prompt = chat.personality?.prompt
		? `${chat.personality?.prompt}`
		: "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible. Your answers should not include any racist, sexist, toxic or transphobic content. Please use proper whitespace and proper Markdown formatting. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.";

	chat.messages = [
		{
			content: prompt,
			id: nanoid(),
			role: "system",
		},
	];
	chat.user = user;

	// Save the new chat.
	const newChat = await chat.save();

	if (newChat) {
		return newChat;
	} else {
		throw createError({
			statusCode: 500,
		});
	}
});
