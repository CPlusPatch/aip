import Stripe from "stripe";
import { getUserByToken } from "~/utils/tokens";
import { getConfig } from "~/utils/config";
import { Transaction } from "~/db/entities/Transaction";
import { Invoice } from "~/db/entities/Invoice";

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

	const config = getConfig();

	const body = await readBody<{
		product: string;
	}>(event);

	if (body.product !== "PREMIUM") {
		throw createError({
			statusCode: 400,
			message: "Invalid product",
		});
	}

	const products = [
		{
			stripe_id: config.stripe.products.premium,
			quantity: 1,
		},
	];

	const stripe = new Stripe(config.stripe.secret_api_key, {
		// @ts-ignore
		apiVersion: null,
		telemetry: false,
	});

	const url = new URL(`http://${event.node.req.headers.host}`);

	const invoice = new Invoice();

	const session = await stripe.checkout.sessions.create({
		line_items: products.map(product => ({
			price: product.stripe_id,
			quantity: product.quantity,
		})),
		mode: "subscription",
		customer: user.stripe_id || undefined,
		success_url: `${url.origin}/settings/invoice`,
		cancel_url: `${url.origin}/settings/invoice`,
		billing_address_collection: "required",
	});

	const transaction = new Transaction();

	transaction.data = session;
	transaction.stripe_id = session.id;
	transaction.user = user;

	invoice.stripe_id = session.invoice as string;
	invoice.user = user;

	await transaction.save();

	invoice.transaction = transaction;
	await invoice.save();

	return {
		url: session.url,
	};
});
