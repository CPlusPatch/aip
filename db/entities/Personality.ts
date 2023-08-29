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

@Entity({
	name: "personalities",
})
export class Personality extends BaseEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

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

	toJSON() {
		// Add default avatar
		return {
			...this,
			avatar:
				this.avatar ||
				`https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
					this.name
				)}`,
		};
	}
}
