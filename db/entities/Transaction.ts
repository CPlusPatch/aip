import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import Stripe from "stripe";
import { User } from "./User";

@Entity()
export class Transaction extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar")
	stripe_id: string;

	@Column("jsonb")
	data: Stripe.Checkout.Session;

	@ManyToOne(() => User)
	@JoinColumn()
	user: User;

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	edited_at?: Date;
}
