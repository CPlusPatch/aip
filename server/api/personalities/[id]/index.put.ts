import DOMPurify from "isomorphic-dompurify";
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
			creator: {
				id: user.id,
			},
			id: event.context.params?.id,
		},
		relations: {
			creator: true,
		},
	});

	if (!personality) {
		throw createError({
			statusCode: 404,
		});
	}

	let body = await readBody<Partial<Personality>>(event);

	// Use DOMPurify on every body attribute
	body = Object.fromEntries(
		Object.entries(body).map(([key, value]) => [
			key,
			typeof value === "string" ? DOMPurify.sanitize(value) : value,
		])
	);

	// Save every changed body attribute to chat, then save
	Object.entries(body).forEach(([key, value]) => {
		if (!["avatar", "name", "description", "prompt"].includes(key)) return;
		// @ts-ignore
		personality[key] = value;
	});

	personality.save();

	return true;
});
