import { AppDataSource } from "~/db/data-source";

export default async () => {
	if (!AppDataSource.isInitialized) await AppDataSource.initialize();
};
