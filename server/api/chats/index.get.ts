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

	// Get all chats where chat.user is the user
	const chats = await Chat.find({
		where: {
			user: {
				id: user.id,
			},
		},
		relations: {
			user: true,
		},
		order: {
			edited_at: "DESC",
		},
	});

	if (chats) {
		return chats;
	} else {
		throw createError({
			statusCode: 500,
		});
	}
});
