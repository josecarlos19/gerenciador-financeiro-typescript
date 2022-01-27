/* eslint-disable no-mixed-spaces-and-tabs */
import { BeforeInsert, BeforeRemove, BeforeUpdate, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Account } from "./Account";
import { Transfer } from "./Transfer";

export type EnumType = "I" | "O";

@Entity("transactions")
export class Transaction {
	@PrimaryColumn()
		id: string;

	@Column()
		description: string;

	@Column({ type: "enum", enum: ["I", "O"] })
		type: EnumType;

	@Column("decimal", { precision: 15, scale: 2 })
		amount: number;

	@Column()
		status: boolean;

	@Column()
		account_id: string;

	@ManyToOne(() => Account)
	@JoinColumn({ name: "account_id" })
		account: Account;

	@Column()
		transfer_id: string;

	@ManyToMany(() => Transfer)
	@JoinColumn({ name: "transfer_id" })
		transfer: Transfer;

	@CreateDateColumn()
		created_at: Date;

	@CreateDateColumn()
		transaction_date: Date;

	constructor() {
		if (!this.id) {
			this.id = uuid();
		}
	}

	@BeforeUpdate()
	@BeforeInsert()
		adjustAmountSignal = async () => {
			if (this.type.includes("I") && this.amount < 0
			|| this.type.includes("O") && this.amount > 0) {
				this.amount = this.amount * (-1);
			}
		};

}

