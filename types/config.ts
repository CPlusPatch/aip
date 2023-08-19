export interface Config {
	oidc_providers: {
		id: string;
		authority: string;
		icon: string;
		client_id: string;
		scopes: string[];
		name: string;
	}[];

	s3: {
		endpoint: string;
		access_key: string;
		secret_access_key: string;
		bucket_name: string;
		public_url: string;
	};

	postgres: {
		host: string;
		port: number;
		password: string;
		username: string;
	};

	ai: {
		base_url: string;
		model: string;
		models: {
			id: string;
			name: string;
			size: string;
			uncensored: boolean;
			port: number;
		}[];
	};

	stripe: {
		secret_api_key: string;
		public_api_key: string;
		webhook_secret: string;
		products: {
			premium: string;
		};
	};
}
