import { app } from "../../../src/app";
import request from "supertest";
import { createConnection } from "../../../src/database";
import { getConnection } from "typeorm";
import * as Faker from "faker";
import { UserFactory, AccountFactory } from "../../factories";
import { User } from "../../../src/entities/User";
import jwt = require("jsonwebtoken");
import { Account } from "../../../src/entities/Account";

let user: User;
let account: Account;

let user2: User;
let account2: Account;

describe("Accounts", () => {
	beforeEach(async () => {
		const connection = await createConnection();
		await connection.dropDatabase();
		await connection.runMigrations();

		const userFactory: UserFactory = new UserFactory();
		const accountFactory: AccountFactory = new AccountFactory();

		user = await userFactory.create({
			email: Faker.internet.email(),
			name: Faker.name.findName()
		});
		account = await accountFactory.create({
			user_id: user.id
		});

		user2 = await userFactory.create({
			email: `Faker.internet.email()${".net"}`,
			name: Faker.name.firstName()
		});
		account2 = await accountFactory.create({
			user_id: user2.id
		});

	});

	afterEach(async () => {
		const connection = getConnection();
		await connection.dropDatabase();
		await connection.close();
	});

	it("should be able to return only user's accounts", async () => {

		const response1 = await request(app)
			.get("/accounts")
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`);

		expect(response1.status).toBe(200);
		expect(response1.body).toHaveLength(1);
		expect(response1.body[0].id).toBe(account.id);

		const response2 = await request(app)
			.get("/accounts")
			.set("Authorization", `Bearer ${jwt.sign({ id: user2.id }, process.env.APP_SECRET)}`);

		expect(response2.status).toBe(200);
		expect(response2.body).toHaveLength(1);
		expect(response2.body[0].id).toBe(account2.id);

	});

	it("should be able to create a new account linked with a valid user", async () => {

		const response = await request(app)
			.post("/accounts")
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				name: account.name
			});

		expect(response.status).toBe(200);
		expect(response.body.name).toBe(account.name);

	});

	it("should not be able to create a new account without a valid user", async () => {
		const response = await request(app)
			.post("/accounts")
			.set("Authorization", `Bearer ${jwt.sign({ id: "34d881fd-f08e-440e-9259-0bf41e982660" }, process.env.APP_SECRET)}`)
			.send({
				name: Faker.company.companyName()
			});

		expect(response.status).toBe(400);

	});

	it("should not be able to create without a account name", async () => {

		const userFactory: UserFactory = new UserFactory();

		const user: User = await userFactory.create();

		const response = await request(app)
			.post("/accounts")
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				name: ""
			});

		expect(response.status).toBe(400);

	});

	it("should be able to return a account sending its id", async () => {

		const response = await request(app)
			.get(`/accounts/${account.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`);

		expect(response.status).toBe(200);
		expect(response.body).not.toBe(null);

	});

	it("should not be able to return a account sending its id using other user", async () => {

		const response = await request(app)
			.get(`/accounts/${account.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user2.id }, process.env.APP_SECRET)}`);

		expect(response.status).toBe(400);

	});

	it("should be able to edit a account", async () => {

		const response = await request(app)
			.put(`/accounts/${account.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				name: "New ACC Name",
				user_id: user.id
			});

		expect(response.status).toBe(200);
		expect(response.body.name).toBe("New ACC Name");

	});

	it("should not be able to edit a account using other user", async () => {

		const response = await request(app)
			.put(`/accounts/${account.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user2.id }, process.env.APP_SECRET)}`)
			.send({
				name: "New ACC Name",
				user_id: user.id
			});

		expect(response.status).toBe(400);
		expect(response.body).not.toHaveProperty("name");

	});

	it("should be able to delete a account", async () => {

		const response = await request(app)
			.delete(`/accounts/${account.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				user_id: user.id,
			});

		expect(response.status).toBe(204);

	});

	it("should not be able to delete a account using other user", async () => {

		const response = await request(app)
			.delete(`/accounts/${account.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user2.id }, process.env.APP_SECRET)}`)
			.send({
				user_id: user.id,
			});

		expect(response.status).toBe(400);

	});

});
