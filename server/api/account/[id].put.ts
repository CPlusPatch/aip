import DOMPurify from "isomorphic-dompurify";
import { User } from "~/db/entities/User";
import { getUserByToken } from "~/utils/tokens";

export default defineEventHandler(async event => {
	// Authenticate user (parse Authorization: Bearer TOKEN) header
	const user = await getUserByToken(
		event.node.req.headers.authorization?.split(" ")[1] ?? ""
	);

	const id = event.context.params?.id ?? "";

	if (user?.id.toString() !== id) {
		throw createError({
			statusCode: 401,
		});
	}

	const body = (await readBody(event)) as Partial<User>;

	const dbUser = await User.findOneBy({
		id: Number.parseInt(id),
	});

	if (!dbUser) return false;

	if (body.display_name)
		dbUser.display_name = DOMPurify.sanitize(body.display_name);
	if (body.avatar) dbUser.avatar = DOMPurify.sanitize(body.avatar);

	await dbUser.save();

	if (dbUser) {
		return {
			...dbUser,
			password: "",
			display_name: body.display_name ?? dbUser.display_name,
			avatar: body.avatar ?? dbUser.avatar,
		};
	} else {
		throw createError({
			statusCode: 404,
		});
	}
});
