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

@Entity({
	name: "personalities",
})
export class Personality {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar")
	name: string;

	@Column("varchar")
	description: string;

	@Column("varchar", {
		nullable: true,
	})
	avatar: string;

	@Column("varchar")
	prompt: string;

	@ManyToOne(() => User)
	@JoinColumn()
	creator: User;

	@CreateDateColumn()
	created_at?: Date;

	@UpdateDateColumn()
	edited_at?: Date;
}
