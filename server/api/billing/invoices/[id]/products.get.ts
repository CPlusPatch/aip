import Stripe from "stripe";
import { Invoice } from "~/db/entities/Invoice";
import { getUserByToken } from "~/utils/tokens";
import { getConfig } from "~/utils/config";

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
