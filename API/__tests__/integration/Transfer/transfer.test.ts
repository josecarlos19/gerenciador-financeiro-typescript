import { app } from "../../../src/app";
import request from "supertest";
import { createConnection } from "../../../src/database";
import { getConnection, getRepository } from "typeorm";
import { UserFactory, AccountFactory, TransactionFactory, TransferFactory } from "../../factories";
import { User } from "../../../src/entities/User";
import jwt = require("jsonwebtoken");
import { Account } from "../../../src/entities/Account";
import { Transaction } from "../../../src/entities/Transaction";
import { Transfer } from "../../../src/entities/Transfer";

let user1: User;
let origin_account1: Account;
let destiny_account1: Account;
let transfer1: Transfer;

let user2: User;
let origin_account2: Account;
let destiny_account2: Account;
let transfer2: Transfer;

describe("Transfers", () => {
	beforeEach(async () => {
		const connection = await createConnection();
		await connection.dropDatabase();
		await connection.runMigrations();

		const userFactory: UserFactory = new UserFactory();
		const accountFactory: AccountFactory = new AccountFactory();
		const transactionFactory: TransactionFactory = new TransactionFactory();
		const transferFactory: TransferFactory = new TransferFactory();

		user1 = await userFactory.create({
			email: "user1@mail.com",
			name: "User #1",
		});

		origin_account1 = await accountFactory.create({
			user_id: user1.id,
			name: "Acc Origin 1"
		});
		destiny_account1 = await accountFactory.create({
			user_id: user1.id,
			name: "Acc Destiny 1"
		});

		transfer1 = await transferFactory.create({
			description: "Transfer 1",
			user_id: user1.id,
			origin_acc_id: origin_account1.id,
			destiny_acc_id: destiny_account1.id,
			amount: 100
		});

		await transactionFactory.create({
			account_id: origin_account1.id,
			description: "Transfer from Acc Origin 1",
			amount: 100,
			type: "I",
			transfer_id: transfer1.id
		});

		await transactionFactory.create({
			account_id: destiny_account1.id,
			description: "Transfer to Acc Destiny 1",
			amount: -100,
			type: "O",
			transfer_id: transfer1.id
		});

		user2 = await userFactory.create({
			email: "user2@mail.com",
			name: "User #2",
		});

		origin_account2 = await accountFactory.create({
			user_id: user2.id,
			name: "Acc Origin 2"
		});
		destiny_account2 = await accountFactory.create({
			user_id: user2.id,
			name: "Acc Destiny 2"
		});

		transfer2 = await transferFactory.create({
			description: "Transfer 2",
			user_id: user2.id,
			origin_acc_id: origin_account2.id,
			destiny_acc_id: destiny_account2.id,
			amount: 200
		});

		await transactionFactory.create({
			account_id: origin_account2.id,
			description: "Transfer from Acc Origin 2",
			amount: 200,
			type: "I",
			transfer_id: transfer2.id
		});

		await transactionFactory.create({
			account_id: destiny_account2.id,
			description: "Transfer to Acc Destiny 2",
			amount: -200,
			type: "O",
			transfer_id: transfer2.id
		});

	});

	afterEach(async () => {
		const connection = getConnection();
		await connection.dropDatabase();
		await connection.close();
	});

	it("should be able to return only user's transfers", async () => {

		const response1 = await request(app)
			.get("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response1.body[0].id).toBe(transfer1.id);
		expect(response1.body).toHaveLength(1);

		const response2 = await request(app)
			.get("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user2.id }, process.env.APP_SECRET)}`);

		expect(response2.body[0].id).toBe(transfer2.id);
		expect(response2.body).toHaveLength(1);

	});

	it("should be able to create a transfer", async () => {
		const response = await request(app)
			.post("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "Transfer 1 Test",
				origin_acc_id: origin_account1.id,
				destiny_acc_id: destiny_account1.id,
				amount: 1000
			});

		expect(response.status).toBe(200);
		expect(response.body.user_id).toBe(user1.id);
		expect(response.body.description).toBe("Transfer 1 Test");
		expect(response.body.origin_acc_id).toBe(origin_account1.id);
		expect(response.body.destiny_acc_id).toBe(destiny_account1.id);
		expect(response.body.amount).toBe(1000);

		const transactions: Transaction[] = await getRepository(Transaction).find({ transfer_id: response.body.id });

		expect(transactions).toHaveLength(2);
		expect(transactions[0].description).toBe(`Transfer to account ${destiny_account1.id}`);
		expect(transactions[0].amount).toBe("-1000.00");
		expect(transactions[0].account_id).toBe(origin_account1.id);
		expect(transactions[0].type).toBe("O");
		expect(transactions[0].transfer_id).toBe(response.body.id);

		expect(transactions[1].description).toBe(`Transfer from account ${origin_account1.id}`);
		expect(transactions[1].amount).toBe("1000.00");
		expect(transactions[1].account_id).toBe(destiny_account1.id);
		expect(transactions[1].type).toBe("I");
		expect(transactions[1].transfer_id).toBe(response.body.id);

	});

	it("should not be able to create a transfer with invalid data", async () => {
		const response = await request(app)
			.post("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "Transfer 1 Test",
				origin_acc_id: origin_account1.id,
				destiny_acc_id: destiny_account1.id,
				amount: 1000
			});

		expect(response.status).toBe(200);
		expect(response.body.user_id).toBe(user1.id);
		expect(response.body.description).toBe("Transfer 1 Test");
		expect(response.body.origin_acc_id).toBe(origin_account1.id);
		expect(response.body.destiny_acc_id).toBe(destiny_account1.id);
		expect(response.body.amount).toBe(1000);

		const transactions: Transaction[] = await getRepository(Transaction).find({ transfer_id: response.body.id });

		expect(transactions).toHaveLength(2);
		expect(transactions[0].description).toBe(`Transfer to account ${destiny_account1.id}`);
		expect(transactions[0].amount).toBe("-1000.00");
		expect(transactions[0].account_id).toBe(origin_account1.id);
		expect(transactions[0].type).toBe("O");
		expect(transactions[0].transfer_id).toBe(response.body.id);

		expect(transactions[1].description).toBe(`Transfer from account ${origin_account1.id}`);
		expect(transactions[1].amount).toBe("1000.00");
		expect(transactions[1].account_id).toBe(destiny_account1.id);
		expect(transactions[1].type).toBe("I");
		expect(transactions[1].transfer_id).toBe(response.body.id);

	});

	it("should not be able to create a transfer without description", async () => {
		const response = await request(app)
			.post("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "",
				origin_acc_id: origin_account1.id,
				destiny_acc_id: destiny_account1.id,
				amount: 1000
			});

		expect(response.status).toBe(400);

	});

	it("should not be able to create a transfer without amount", async () => {
		const response = await request(app)
			.post("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "Transfer Test",
				origin_acc_id: origin_account1.id,
				destiny_acc_id: destiny_account1.id,
				amount: ""
			});

		expect(response.status).toBe(400);

	});

	it("should not be able to create a transfer without origin account", async () => {
		const response = await request(app)
			.post("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "Transfer Test",
				origin_acc_id: "",
				destiny_acc_id: destiny_account1.id,
				amount: "1000"
			});

		expect(response.status).toBe(400);

	});

	it("should not be able to create a transfer without destiny account", async () => {
		const response = await request(app)
			.post("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "Transfer Test",
				origin_acc_id: origin_account1.id,
				destiny_acc_id: "",
				amount: "1000"
			});

		expect(response.status).toBe(400);

	});

	it("should not be able to create a transfer operanting in the same account", async () => {
		const response = await request(app)
			.post("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "Transfer Test",
				origin_acc_id: origin_account1.id,
				destiny_acc_id: origin_account1.id,
				amount: 1000
			});

		expect(response.status).toBe(400);

	});

	it("should not be able to create a transfer with accounts of other user", async () => {
		const response = await request(app)
			.post("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user2.id }, process.env.APP_SECRET)}`)
			.send({
				description: "Transfer Test",
				origin_acc_id: origin_account1.id,
				destiny_acc_id: destiny_account2.id,
				amount: 1000
			});

		expect(response.status).toBe(400);

	});

	it("should be able to return one transfer by ID", async () => {
		const response = await request(app)
			.get(`/transfers/${transfer1.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response.status).toBe(200);
		expect(response.body).not.toBe(null);
		expect(response.body.id).toBe(transfer1.id);
		expect(response.body.user_id).toBe(transfer1.user_id);
	});

	it("should be able to edit a transfer", async () => {
		const response = await request(app)
			.put(`/transfers/${transfer1.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "Transfer 1 Test Edited",
				origin_acc_id: origin_account1.id,
				destiny_acc_id: destiny_account1.id,
				amount: 5000
			});

		expect(response.status).toBe(200);
		expect(response.body.user_id).toBe(user1.id);
		expect(response.body.description).toBe("Transfer 1 Test Edited");
		expect(response.body.origin_acc_id).toBe(origin_account1.id);
		expect(response.body.destiny_acc_id).toBe(destiny_account1.id);
		expect(response.body.amount).toBe(5000);

		const transactions: Transaction[] = await getRepository(Transaction).find({ transfer_id: response.body.id });

		expect(transactions).toHaveLength(2);
		expect(transactions[0].description).toBe(`Transfer to account ${destiny_account1.id}`);
		expect(transactions[0].amount).toBe("-5000.00");
		expect(transactions[0].account_id).toBe(origin_account1.id);
		expect(transactions[0].type).toBe("O");
		expect(transactions[0].transfer_id).toBe(response.body.id);

		expect(transactions[1].description).toBe(`Transfer from account ${origin_account1.id}`);
		expect(transactions[1].amount).toBe("5000.00");
		expect(transactions[1].account_id).toBe(destiny_account1.id);
		expect(transactions[1].type).toBe("I");
		expect(transactions[1].transfer_id).toBe(response.body.id);

	});

	it("should not be able to edit a transfer of other user", async () => {
		const response = await request(app)
			.put(`/transfers/${transfer1.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user2.id }, process.env.APP_SECRET)}`)
			.send({
				description: "Transfer 1 Test Edited",
				origin_acc_id: origin_account1.id,
				destiny_acc_id: destiny_account1.id,
				amount: 5000
			});

		expect(response.status).toBe(400);

	});

	it("should be able to remove a transfer", async () => {
		const response = await request(app)
			.delete(`/transfers/${transfer1.id}`)
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response.status).toBe(204);
	});

	it("both responses should return with status TRUE", async () => {
		const response = await request(app)
			.post("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "Transfer 1 Test",
				origin_acc_id: origin_account1.id,
				destiny_acc_id: destiny_account1.id,
				amount: 1000
			});

		expect(response.status).toBe(200);
		expect(response.body.user_id).toBe(user1.id);
		expect(response.body.description).toBe("Transfer 1 Test");
		expect(response.body.origin_acc_id).toBe(origin_account1.id);
		expect(response.body.destiny_acc_id).toBe(destiny_account1.id);
		expect(response.body.amount).toBe(1000);

		const transactions: Transaction[] = await getRepository(Transaction).find({ transfer_id: response.body.id });

		expect(transactions).toHaveLength(2);
		expect(transactions[0].description).toBe(`Transfer to account ${destiny_account1.id}`);
		expect(transactions[0].amount).toBe("-1000.00");
		expect(transactions[0].account_id).toBe(origin_account1.id);
		expect(transactions[0].type).toBe("O");
		expect(transactions[0].transfer_id).toBe(response.body.id);
		expect(transactions[0].status).toBe(true);

		expect(transactions[1].description).toBe(`Transfer from account ${origin_account1.id}`);
		expect(transactions[1].amount).toBe("1000.00");
		expect(transactions[1].account_id).toBe(destiny_account1.id);
		expect(transactions[1].type).toBe("I");
		expect(transactions[1].transfer_id).toBe(response.body.id);
		expect(transactions[1].status).toBe(true);
	});

});
