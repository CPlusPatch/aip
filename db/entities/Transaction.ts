import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

export enum Role {
	ADMIN = "admin",
	GUEST = "guest",
}

export enum Subscriptions {
	NONE = "none",
	PREMIUM = "premium",
}

@Entity()
export class Transaction {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar")
	stripe_id: string;

	@Column("jsonb")
	data: any;

	@ManyToOne(() => User)
	@JoinColumn()
	user: User;
}
