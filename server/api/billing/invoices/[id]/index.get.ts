import { getUserAndErrorIfNone } from "~/server/utils/authMiddleware";
import { Invoice } from "~/db/entities/Invoice";

export default defineEventHandler(async event => {
	// Make sure user is identified
	await getUserAndErrorIfNone(event);

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
