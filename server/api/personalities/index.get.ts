import { getUserAndErrorIfNone } from "~/server/utils/authMiddleware";
import { Personality } from "~/db/entities/Personality";

// Returns all chats belonging to a user
export default defineEventHandler(async event => {
	const user = await getUserAndErrorIfNone(event);

	// Get all chats where chat.user is the user
	const chats = await Personality.find({
		where: {
			creator: {
				id: user.id,
			},
		},
		relations: {
			creator: true,
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
