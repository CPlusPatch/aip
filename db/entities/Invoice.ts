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
import { Transaction } from "./Transaction";

@Entity()
export class Invoice extends BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar", {
		nullable: true,
	})
	stripe_id?: string;

	@Column("jsonb", {
		nullable: true,
	})
	data?: Stripe.Invoice;

	@ManyToOne(() => User)
	@JoinColumn()
	user: User;

	@ManyToOne(() => Transaction)
	@JoinColumn()
	transaction: Transaction;

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	edited_at?: Date;

	isValid() {
		return !!(this.data && this.stripe_id);
	}
}
