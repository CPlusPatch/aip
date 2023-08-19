import { DataSource } from "typeorm";
import { User } from "./entities/User";
import "reflect-metadata";
import { Token } from "./entities/Token";
import { Chat } from "./entities/Chat";
import { Personality } from "./entities/Personality";
import { Transaction } from "./entities/Transaction";
import { Invoice } from "./entities/Invoice";
import { getConfig } from "~/utils/config";

const config = getConfig();

const AppDataSource = new DataSource({
	type: "postgres",
	host: config.postgres.host || "localhost",
	port: config.postgres.port || 5432,
	username: config.postgres.username || "aip",
	password: config.postgres.password || "",
	database: "aip",
	synchronize: true,
	entities: [User, Token, Chat, Personality, Transaction, Invoice],
});

export { AppDataSource };
