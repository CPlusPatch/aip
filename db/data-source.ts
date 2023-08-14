import { DataSource } from "typeorm";
import { User } from "./entities/User";
import "reflect-metadata";
import { Token } from "./entities/Token";

const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.POSTGRES_HOST || "localhost",
	port: Number(process.env.POSTGRES_PORT) || 5432,
	username: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	// database: "./web.sqlite",
	database: "aip",
	synchronize: true,
	entities: [User, Token],
});

export { AppDataSource };
