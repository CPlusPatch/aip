import Stripe from "stripe";
import { Invoice } from "~/db/entities/Invoice";
import { getUserAndErrorIfNone } from "~/server/utils/authMiddleware";

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
			transaction: true,
		},
	});

	if (!invoice) {
		throw createError({
			statusCode: 404,
			message: "Invoice not found",
		});
	}

	const config = getConfig();

	const stripe = new Stripe(config.stripe.secret_api_key, {
		// @ts-ignore
		apiVersion: null,
		telemetry: false,
	});

	const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
		// @ts-ignore
		invoice.transaction.stripe_id,
		{
			expand: ["line_items"],
		}
	);
	const lineItems = sessionWithLineItems.line_items;

	if (lineItems) {
		return lineItems.data;
	} else {
		throw createError({
			statusCode: 404,
			message: "Invoice not found",
		});
	}
});
