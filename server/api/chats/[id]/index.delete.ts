import { Chat } from "~/db/entities/Chat";
import { getUserAndErrorIfNone } from "~/server/utils/authMiddleware";

// Returns all chats belonging to a user
export default defineEventHandler(async event => {
	const user = await getUserAndErrorIfNone(event);
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

	if (chat && (await chat.remove())) {
		return chat;
	} else {
		throw createError({
			statusCode: 500,
		});
	}
});
