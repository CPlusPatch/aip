import { AppDataSource } from "~/db/data-source";
import { getUserByToken } from "~/utils/tokens";
import { Chat } from "~/db/entities/Chat";

// Returns all chats belonging to a user
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

	// Get all chats where chat.user is the user
	const chat = await AppDataSource.getRepository(Chat).findOne({
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

	
	if (chat && await AppDataSource.getRepository(Chat).remove([chat])) {
		return true;
	} else {
		throw createError({
			statusCode: 500,
		});
	}
});
