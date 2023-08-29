import { Personality } from "~/db/entities/Personality";
import { getUserAndErrorIfNone } from "~/server/utils/authMiddleware";

export default defineEventHandler(async event => {
	await getUserAndErrorIfNone(event);

	const personality = await Personality.findOne({
		where: {
			id: event.context.params?.id,
		},
		relations: {
			creator: true,
		},
	});

	if (personality) {
		return personality;
	} else {
		throw createError({
			statusCode: 500,
		});
	}
});
