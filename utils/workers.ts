import { readFileSync, writeFileSync } from "fs";
import { getWorkerConfig } from "~/utils/config";
import type { WorkerConfig } from "~/types/config";

type Merge<A, B> = {
	[K in keyof A | keyof B]: K extends keyof A & keyof B
		? A[K] | B[K]
		: K extends keyof B
		? B[K]
		: K extends keyof A
		? A[K]
		: never;
};

export class Workers {
	workers: Merge<
		WorkerConfig["workers"][0],
		{
			occupied: boolean;
			noRetryUntil: number;
		}
	>[] = [];

	constructor() {
		try {
			this.workers = JSON.parse(
				readFileSync("/tmp/aip-workers.json", "utf-8")
			);
		} catch (e) {
			this.workers = getWorkerConfig().workers.map(model => ({
				...model,
				occupied: false,
				noRetryUntil: 0,
			}));
		}
	}

	findNextavailable(model: string) {
		return this.workers.findIndex(
			worker =>
				worker.model === model &&
				!worker.occupied &&
				worker.noRetryUntil < Date.now()
		);
	}

	writeChanges() {
		writeFileSync("/tmp/aip-workers.json", JSON.stringify(this.workers));
	}
}
