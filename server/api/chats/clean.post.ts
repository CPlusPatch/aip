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

	const toBeDeleted: Chat[] = chats.filter(c => c.messages.length <= 1);

	// Delete all chats inside toBeDeleted
	await Promise.all(
		toBeDeleted.map(async chat => {
			await chat.remove();
		})
	);

	if (chats) {
		// Remove all deleted chats from chat
		return chats.filter(chat => !toBeDeleted.includes(chat));
	} else {
		throw createError({
			statusCode: 500,
		});
	}
});
