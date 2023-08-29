import { getUserByToken } from "~/utils/tokens";

export default defineEventHandler(async event => {
	const user = await getUserByToken(
		event.node.req.headers.authorization?.split(" ")[1] ?? ""
	);

	return user;
});
