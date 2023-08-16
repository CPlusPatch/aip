import { AppDataSource } from "~/db/data-source";
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

	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize();
	}

	const chat = new Chat();

	chat.title = "New chat";
	chat.messages = [];
	chat.user = user;

	// Save the new chat.
	const newChat = await AppDataSource.getRepository(Chat).save(chat);

	if (newChat) {
		return newChat;
	} else {
		throw createError({
			statusCode: 500,
		});
	}
});
