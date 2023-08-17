import Stripe from "stripe";
import { Transaction } from "~/db/entities/Transaction";
import { Subscriptions } from "~/db/entities/User";
import { getConfig } from "~/utils/config";
import { Invoice } from "~/db/entities/Invoice";

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
						expand: ["line_items", "invoice"],
					}
				);
			const lineItems = sessionWithLineItems.line_items;

			const invoice = await Invoice.findOne({
				where: {
					transaction: {
						// @ts-ignore
						stripe_id: stripeEvent.data.object.id,
					},
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

			invoice.data = sessionWithLineItems.invoice as Stripe.Invoice;
			invoice.stripe_id = (
				sessionWithLineItems.invoice as Stripe.Invoice
			).id;
			await invoice.save();

			lineItems?.data.forEach(async lineItem => {
				if (lineItem.price?.id === config.stripe.products.premium) {
					const user = (
						await Transaction.findOne({
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
						await user.save();
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
