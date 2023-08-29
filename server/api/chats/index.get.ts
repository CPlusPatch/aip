import { Chat } from "~/db/entities/Chat";
import { getUserAndErrorIfNone } from "~/server/utils/authMiddleware";

// Returns all chats belonging to a user
export default defineEventHandler(async event => {
	const user = await getUserAndErrorIfNone(event);

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
