import { Subscriptions } from "~/db/entities/User";

export const models = [
	{
		name: "Perseus Mini",
		smallName: "Mini",
		model: "L2-7BU-L1",
		description:
			"Smaller model, useful for quick testing and when you need faster results",
		tiers: [Subscriptions.NONE],
	},
	{
		name: "Perseus Pro",
		smallName: "Pro",
		model: "L2-13BU-L1",
		description:
			"Larger model, can do more complicated tasks such as poetry or explanations",
		tiers: [Subscriptions.NONE],
	},
	{
		name: "Perseus Code",
		smallName: "Code",
		model: "L2-13BU-L1-code",
		description: "Specialized model for programming and coding",
		tiers: [Subscriptions.PREMIUM],
	},
];
