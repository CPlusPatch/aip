import { Invoice } from "~/db/entities/Invoice";
import { getUserByToken } from "~/utils/tokens";

export default defineEventHandler(async event => {
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

	const invoices = await Invoice.find({
		where: {
			user: {
				id: user.id,
			},
		},
		relations: {
			user: true,
		},
		order: {
			created_at: "DESC",
		},
	});

	if (invoices) {
		return invoices.map(i => ({
			...i,
			user: {
				...i.user,
				password: "",
			},
		}));
	}
});
