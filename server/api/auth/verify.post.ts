import { getUserByToken } from "~/utils/tokens";

export default defineEventHandler(async event => {
	const user = await getUserByToken(
		event.node.req.headers.authorization?.split(" ")[1] ?? ""
	);

	const body = await readBody<{
		code: string;
	}>(event);

	if (user?.emailVerificationToken !== body.code) {
		throw createError({
			statusCode: 400,
			message: "Invalid code",
		});
	} else {
		user.isEmailVerified = true;
		user.emailVerificationToken = "";

		await user.save();

		return true;
	}
});
