import { nanoid } from "nanoid";
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

	const chat = new Chat();

	chat.title = "New chat";
	chat.messages = [
		{
			content:
				"You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please use proper whitespace and proper Markdown formatting. If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",
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
