import { getUserByToken } from "~/utils/tokens";
import { Personality } from "~/db/entities/Personality";

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
