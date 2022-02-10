import { app } from "../../../src/app";
import request from "supertest";
import { createConnection } from "../../../src/database";
import { getConnection } from "typeorm";
import { UserFactory, AccountFactory, TransactionFactory } from "../../factories";
import { User } from "../../../src/entities/User";
import jwt = require("jsonwebtoken");
import * as Faker from "faker";
import { Account } from "../../../src/entities/Account";
import { Transaction } from "../../../src/entities/Transaction";

let user: User;
let account: Account;
let transaction: Transaction;

let user2: User;
let account2: Account;
let transaction2: Transaction;

describe("Transactions", () => {
	beforeEach(async () => {
		const connection = await createConnection();
		await connection.dropDatabase();
		await connection.runMigrations();

		const userFactory: UserFactory = new UserFactory();
		const accountFactory: AccountFactory = new AccountFactory();
		const transactionFactory: TransactionFactory = new TransactionFactory();

		user = await userFactory.create({
			email: Faker.internet.email(),
			name: Faker.name.findName()
		});
		account = await accountFactory.create({
			user_id: user.id
		});
		transaction = await transactionFactory.create({
			account_id: account.id
		});

		user2 = await userFactory.create({
			email: `Faker.internet.email()${".net"}`,
			name: Faker.name.firstName()
		});
		account2 = await accountFactory.create({
			user_id: user2.id
		});
		transaction2 = await transactionFactory.create({
			account_id: account2.id
		});

	});

	afterEach(async () => {
		const connection = getConnection();
		await connection.dropDatabase();
		await connection.close();
	});


	it("should be able to return only user's transactions", async () => {

		const response1 = await request(app)
			.get("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				id: account.id
			});

		expect(response1.status).toBe(200);
		expect(response1.body).toHaveLength(1);
		expect(response1.body[0].description).toBe(transaction.description);

		const response2 = await request(app)
			.get("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user2.id }, process.env.APP_SECRET)}`)
			.send({
				id: account2.id
			});

		expect(response2.status).toBe(200);
		expect(response2.body).toHaveLength(1);
		expect(response2.body[0].description).toBe(transaction2.description);

	});

	it("should be able to create a transaction", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				description: "T1",
				type: "I",
				amount: 100,
				account_id: account.id
			});

		expect(response.status).toBe(200);
		expect(response.body.description).toBe("T1");
	});

	it("should not be able to create a transaction missing data", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				description: "",
				type: "I",
				amount: 100,
				account_id: account.id
			});

		expect(response.status).toBe(400);
	});

	it("should not be able to create a transaction with not valid TYPE", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				description: "T1",
				type: "P",
				amount: 100,
				account_id: account.id
			});

		expect(response.status).toBe(400);
	});

	it("transactions of type INPUT need to have positive signal", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				description: "T1",
				type: "O",
				amount: +100,
				account_id: account.id
			});

		expect(response.status).toBe(200);
		expect(response.body.amount).toBe(-100);
	});

	it("transactions of type OUTPUT need to have negative signal", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				description: "T1",
				type: "I",
				amount: -100,
				account_id: account.id
			});

		expect(response.status).toBe(200);
		expect(response.body.amount).toBe(+100);
	});

	it("should be able to show a transaction using it's ID", async () => {
		const response = await request(app)
			.get(`/transactions/${transaction.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				account_id: account.id,
			});

		expect(response.status).toBe(200);
		expect(response.body).not.toBe(null);
	});

	it("should not be able to show a transaction using it's ID using other user", async () => {
		const response = await request(app)
			.get(`/transactions/${transaction.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user2.id }, process.env.APP_SECRET)}`)
			.send({
				account_id: account.id,
			});

		expect(response.status).toBe(400);

	});

	it("should be able to edit a transaction", async () => {
		const response = await request(app)
			.put(`/transactions/${transaction.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				description: "T1 Updated",
				type: "I",
				amount: 1000,
				status: true
			});

		expect(response.status).toBe(200);
		expect(response.body.description).toBe("T1 Updated");
		expect(response.status).toBe(200);
		expect(response.body.description).toBe("T1 Updated");
		expect(response.body.type).toBe("I");
		expect(response.body.amount).toBe(1000);
		expect(response.body.status).toBe(true);

	});

	it("should not be able to edit a transaction with other user", async () => {
		const response = await request(app)
			.put(`/transactions/${transaction.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user2.id }, process.env.APP_SECRET)}`)
			.send({
				description: "T1 Updated",
				type: "I",
				amount: 1000,
				status: true
			});

		expect(response.status).toBe(400);
	});

	it("should be able to delete a transaction", async () => {
		const response = await request(app)
			.delete(`/transactions/${transaction.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`);

		expect(response.status).toBe(204);
	});

	it("should not be able to delete a transaction of other user", async () => {
		const response = await request(app)
			.delete(`/transactions/${transaction.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user2.id }, process.env.APP_SECRET)}`);

		expect(response.status).toBe(400);
	});

	it("should not be able to delete a account with transactions associates", async () => {

		const response = await request(app)
			.delete(`/accounts/${account.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				user_id: user.id,
			});

		expect(response.status).toBe(400);

	});

});
