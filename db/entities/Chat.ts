import {
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
export class Chat {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("jsonb")
	messages: {
		content: string;
		role: "user" | "system";
		id: string;
	}[];

	@ManyToOne(() => User)
	@JoinColumn()
	user: User;

	@ManyToOne(() => Personality, {
		nullable: true,
	})
	@JoinColumn()
	personality: Personality;

	@Column("varchar")
	title: string;

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	edited_at?: Date;
}
