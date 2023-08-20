import { writeFileSync } from "fs";
import { getWorkerConfig } from "~/utils/config";

export default async () => {
	const workerConfig = getWorkerConfig();
	await writeFileSync(
		"/tmp/aip-workers.json",
		JSON.stringify(
			workerConfig.workers.map(model => ({
				...model,
				occupied: false,
			}))
		)
	);
	console.log("Cleared worker lockfile");
};
