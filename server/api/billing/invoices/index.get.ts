import { getUserAndErrorIfNone } from "~/server/utils/authMiddleware";
import { Invoice } from "~/db/entities/Invoice";

export default defineEventHandler(async event => {
	// Make sure user is identified
	const user = await getUserAndErrorIfNone(event);

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
		return invoices.filter(i => i.isValid());
	}
});
