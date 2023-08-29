import { getUserByToken } from "~/utils/tokens";

export const getUserAndErrorIfNone = async (event: any) => {
	// Make sure user is identified
	const user = await getUserByToken(
		event.node.req.headers.authorization?.split(" ")[1] ?? ""
	);

	// Throw an error if the sender is not authorized.
	if (!user) {
		throw createError({
			statusCode: 401,
		});
	}

	return user;
};
