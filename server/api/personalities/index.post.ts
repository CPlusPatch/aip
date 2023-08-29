import { getUserAndErrorIfNone } from "~/server/utils/authMiddleware";
import { Personality } from "~/db/entities/Personality";

export default defineEventHandler(async event => {
	const user = await getUserAndErrorIfNone(event);

	const body = await readBody<Partial<Personality>>(event);

	// Check if name, prompt and description and in body
	if (!body.name || !body.prompt || !body.description) {
		throw createError({
			statusCode: 400,
			message: "",
		});
	}

	const personality = new Personality();
	personality.creator = user;
	personality.name = body.name ?? "";
	personality.prompt = body.prompt ?? "";
	personality.description = body.description ?? "";

	await personality.save();

	return personality;
});
