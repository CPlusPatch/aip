import Stripe from "stripe";
import { Transaction } from "~/db/entities/Transaction";
import { AppDataSource } from "~/db/data-source";
import { Subscriptions, User } from "~/db/entities/User";
import { getConfig } from "~/utils/config";

export default defineEventHandler(async event => {
	const sig = event.node.req.headers["stripe-signature"] as string;

	const config = getConfig();

	const stripe = new Stripe(config.stripe.secret_api_key, {
		// @ts-ignore
		apiVersion: null,
		telemetry: false,
	});

	let stripeEvent: Stripe.Event;

	function getBody(): Promise<Buffer> {
		return new Promise(resolve => {
			const bodyParts: any[] = [];
			let body;
			event.node.req
				.on("data", chunk => {
					bodyParts.push(chunk);
				})
				.on("end", () => {
					body = Buffer.concat(bodyParts);
					resolve(body);
				});
		});
	}

	try {
		stripeEvent = stripe.webhooks.constructEvent(
			await getBody(),
			sig,
			config.stripe.webhook_secret
		);
	} catch (e: any) {
		console.error(e.message);
		throw createError({
			statusCode: 400,
			message: `Webhook error: ${e.message}`,
		});
	}

	switch (stripeEvent.type) {
		case "checkout.session.completed": {
			const sessionWithLineItems =
				await stripe.checkout.sessions.retrieve(
					// @ts-ignore
					stripeEvent.data.object.id,
					{
						expand: ["line_items"],
					}
				);
			const lineItems = sessionWithLineItems.line_items;

			lineItems?.data.forEach(async lineItem => {
				if (lineItem.price?.id === config.stripe.products.premium) {
					const user = (
						await AppDataSource.getRepository(Transaction).findOne({
							relations: {
								user: true,
							},
							where: {
								// @ts-ignore
								stripe_id: stripeEvent.data.object.id,
							},
						})
					)?.user;

					if (user) {
						user.subscription = Subscriptions.PREMIUM;
						user.stripe_id =
							sessionWithLineItems.customer as string;
						await AppDataSource.getRepository(User).save(user);
					} else {
						throw createError({
							statusCode: 404,
							message: "Transaction user not found",
						});
					}
				}
			});

			break;
		}
	}
});
