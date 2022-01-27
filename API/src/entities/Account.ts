/* eslint-disable no-mixed-spaces-and-tabs */
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import {User} from "./User";

@Entity("accounts")
export class Account {
  @PrimaryColumn()
  	id: string;

  @Column()
  	name: string;

  @Column()
  	user_id: string;

  @ManyToOne(()=> User)
  @JoinColumn({name: "user_id"})
  	user: User;

  @CreateDateColumn()
  	created_at: Date;

  constructor() {
  	if (!this.id) {
  		this.id = uuid();
  	}
  }

}

