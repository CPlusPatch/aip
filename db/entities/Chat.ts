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
import { User } from "./User";
import { Personality } from "./Personality";

@Entity()
export class Chat extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column("jsonb")
	messages: {
		content: string;
		role: "user" | "system" | "assistant";
		id: string;
	}[];

	@ManyToOne(() => User)
	@JoinColumn()
	user: User;

	@ManyToOne(() => Personality, {
		nullable: true,
	})
	@JoinColumn()
	personality?: Personality;

	@Column("varchar")
	title: string;

	@Column("varchar", {
		default: "L2-7BU-L1",
	})
	model: string;

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	edited_at?: Date;
}
