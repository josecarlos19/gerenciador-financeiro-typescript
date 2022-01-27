/* eslint-disable no-mixed-spaces-and-tabs */
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import { Account } from "./Account";
import { Transaction } from "./Transaction";
import { User } from "./User";


@Entity("transfers")
export class Transfer {

  @PrimaryColumn()
  	id: string;

  @Column()
  	description: string;

  @Column("decimal", { precision: 15, scale: 2 })
  	amount: number;

  @Column()
  	origin_acc_id: string;
  @ManyToOne(() => Account)
  @JoinColumn({ name: "origin_acc_id" })
  	origin_account: Account;

  @Column()
  	destiny_acc_id: string;
  @ManyToOne(() => Account)
  @JoinColumn({ name: "destiny_acc_id" })
  	destiny_account: Account;

  @Column()
  	user_id: string;
  @ManyToOne(() => Account)
  @JoinColumn({ name: "user_id" })
  	user: User;

  @CreateDateColumn()
  	created_at: Date;

  constructor() {
  	if (!this.id) {
  		this.id = uuid();
  	}
  }

}

