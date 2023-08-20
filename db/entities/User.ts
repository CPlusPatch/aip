import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

export enum Role {
	ADMIN = "admin",
	GUEST = "guest",
}

export enum Subscriptions {
	NONE = "none",
	PREMIUM = "premium",
}

@Entity()
export class User extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar", {
		unique: true,
	})
	username: string;

	@Column("varchar")
	display_name: string;

	@Column("varchar")
	password: string; // In the format hashedpassword:salt

	@Column("varchar", {
		default: Role.GUEST,
	})
	role: Role;

	@Column("varchar", {
		nullable: true,
	})
	avatar?: string;

	@Column("varchar", {
		nullable: true,
	})
	banner?: string;

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	edited_at?: Date;

	@Column("varchar", {
		default: Subscriptions.NONE,
	})
	subscription: Subscriptions;

	@Column("bigint", {
		default: 0,
	})
	credits: number;

	@Column("varchar", {
		nullable: true,
	})
	stripe_id?: string;

	@Column("boolean", {
		default: false,
	})
	lastPaymentFailed: boolean;

	@Column("jsonb", { nullable: true })
	oauthAccounts?: { provider: string; id: string }[];

	@Column("varchar", { nullable: true })
	emailVerificationToken?: string;

	@Column("varchar", { nullable: true, unique: true })
	email: string;

	@Column("boolean", {
		default: false,
	})
	isEmailVerified: boolean;

	toJSON() {
		return {
			...this,
			password: "",
			stripe_id: "",
			emailVerificationToken: "",
		};
	}
}
