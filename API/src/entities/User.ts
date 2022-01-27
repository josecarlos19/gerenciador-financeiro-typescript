/* eslint-disable no-mixed-spaces-and-tabs */
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { v4 as uuid } from "uuid";
import bcrypt = require("bcrypt");
import jwt = require("jsonwebtoken");
@Entity("users")
export class User {
	@PrimaryColumn()
		id: string;

	@Column()
		email: string;

	@Column()
		name: string;

	@Column()
		password: string;

	@CreateDateColumn()
		created_at: Date;

	constructor() {
		if (!this.id) {
			this.id = uuid();
		}
	}

	checkPassword = async function (password) {
		return await bcrypt.compare(password, this.password);
	};

	generateToken = function () {
		return jwt.sign({id: this.id}, process.env.APP_SECRET);
	};

	@BeforeUpdate()
	@BeforeInsert()
		hashPassword = async() => {
			this.password = await bcrypt.hash(this.password, 10);
		};
}

