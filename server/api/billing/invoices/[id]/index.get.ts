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

	const invoiceId = event.context.params?.id ?? "";

	const invoice = await Invoice.findOne({
		where: {
			id: Number.parseInt(invoiceId),
		},
		relations: {
			user: true,
		},
	});

	if (invoice && invoice.isValid()) {
		return invoice;
	} else {
		throw createError({
			statusCode: 404,
			message: "Invoice not found",
		});
	}
});
