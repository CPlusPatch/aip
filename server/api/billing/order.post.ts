import Stripe from "stripe";
import { getUserByToken } from "~/utils/tokens";
import { getConfig } from "~/utils/config";
import { AppDataSource } from "~/db/data-source";
import { Transaction } from "~/db/entities/Transaction";

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
		products: {
			stripe_id: string;
			quantity: number;
		}[];
	}>(event);

	const stripe = new Stripe(config.stripe.secret_api_key, {
		// @ts-ignore
		apiVersion: null,
		telemetry: false,
	});

	const url = new URL(`http://${event.node.req.headers.host}`);

	const session = await stripe.checkout.sessions.create({
		line_items: body.products.map(product => ({
			price: product.stripe_id,
			quantity: product.quantity,
		})),
		mode: "subscription",
		customer: user.stripe_id,
		success_url: `${url.origin}/billing/success`,
		cancel_url: `${url.origin}/billing/failure`,
	});

	const transaction = new Transaction();

	transaction.data = session;
	transaction.stripe_id = session.id;
	transaction.user = user;

	await AppDataSource.getRepository(Transaction).save(transaction);

	return {
		url: session.url,
	};
});
