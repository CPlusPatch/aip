import { Personality } from "~/db/entities/Personality";
import { getUserByToken } from "~/utils/tokens";

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
