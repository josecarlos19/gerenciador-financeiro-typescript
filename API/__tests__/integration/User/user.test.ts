/* eslint-disable no-var */
import { app } from "../../../src/app";
import request from "supertest";
import { createConnection } from "../../../src/database";
import { getConnection } from "typeorm";
import * as Faker from "faker";
import bcrypt = require("bcrypt");
import { UserFactory } from "../../factories";
import { User } from "../../../src/entities/User";

describe("User", () => {

	beforeAll(async () => {
		const connection = await createConnection();
		await connection.dropDatabase();
		await connection.runMigrations();
	});

	afterAll(async () => {
		const connection = getConnection();
		await connection.dropDatabase();
		await connection.close();
	});

	it("should be able to create a new user", async () => {
		const response = await request(app)
			.post("/users")
			.send({
				name: Faker.name.findName(),
				email: Faker.internet.email(),
				password: Faker.internet.password()
			});

		expect(response.status).toBe(200);
	});

	it("should not be able to create a new user missing any data", async () => {
		const response = await request(app)
			.post("/users")
			.send({
				name: "",
				email: Faker.internet.email(),
				password: Faker.internet.password()
			});

		expect(response.status).toBe(400);
	});

	it("should be able to edit the user", async () => {
		const NewName = Faker.name.findName();
		const Newemail = Faker.internet.email();
		const Newpassword = Faker.internet.password();

		const userFactory: UserFactory = new UserFactory();

		const user: User = await userFactory.create();

		const response = await request(app)
			.put(`/users/${user.id}`)
			.send({
				name: NewName,
				email: Newemail,
				password: Newpassword
			});

		expect(response.status).toBe(200);
		expect(response.body.name).toBe(NewName);
		expect(response.body.email).toBe(Newemail);
		expect(await bcrypt.compare(Newpassword, response.body.password)).toBe(true);
	});

	it("should be able to get all user registered", async () => {
		const userFactory: UserFactory = new UserFactory();

		await userFactory.create();

		const response = await request(app).
			get("/users");

		expect(response.status).toBe(200);
	});

});
