import { writeFileSync } from "fs";
import { getConfig } from "~/utils/config";

export default async () => {
	const config = getConfig();
	await writeFileSync("/tmp/aip-workers.json", JSON.stringify(config.ai.models.map(model => ({
		id: model.id,
		occupied: false,
	}))));
	console.log("Cleared worker lockfile");
};
