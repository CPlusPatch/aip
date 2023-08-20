import { readFileSync } from "fs";
import { parse } from "smol-toml";
import { Config, WorkerConfig } from "types/config";

export const getConfig = () => {
	let config: Config = {
		oidc_providers: [],
		ai: {
			base_url: "",
			model: "",
			models: [],
		},
		postgres: {
			host: "",
			port: 0,
			password: "",
			username: "",
		},
		s3: {
			access_key: "",
			bucket_name: "",
			endpoint: "",
			public_url: "",
			secret_access_key: "",
		},
		stripe: {
			products: {
				premium: "",
			},
			public_api_key: "",
			secret_api_key: "",
			webhook_secret: "",
		},
		smtp: {
			host: "",
			password: "",
			user: "",
		},
	};

	try {
		config = parse(
			readFileSync("./config/config.toml").toString("utf-8")
		) as unknown as Config;
	} catch (err) {
		console.error(err);
	}

	return config;
};

export const getWorkerConfigConfig = () => {
	let config: WorkerConfig = {
		workers: [],
	};

	try {
		config = parse(
			readFileSync("./config/workers.toml").toString("utf-8")
		) as unknown as WorkerConfig;
	} catch (err) {
		console.error(err);
	}

	return config;
};
