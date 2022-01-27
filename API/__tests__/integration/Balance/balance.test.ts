import { app } from "../../../src/app";
import request from "supertest";
import { createConnection } from "../../../src/database";
import { getConnection } from "typeorm";
import { UserFactory, AccountFactory, TransactionFactory, TransferFactory } from "../../factories";
import { User } from "../../../src/entities/User";
import jwt = require("jsonwebtoken");
import { Account } from "../../../src/entities/Account";
import { Transaction } from "../../../src/entities/Transaction";
import { Transfer } from "../../../src/entities/Transfer";
import moment from "moment";

let user1: User;
let mainAccount: Account;
let secondaryAccount: Account;
// let transaction1_O: Transaction;
// let transaction1_D: Transaction;
// let transfer1: Transfer;

let user2: User;
let alternativeAccount1: Account;
let alternativeAccount2: Account;
// let transaction2_O: Transaction;
// let transaction2_D: Transaction;
// let transfer2: Transfer;

describe("User Balance", () => {

	beforeAll(async () => {
		const connection = await createConnection();
		await connection.dropDatabase();
		await connection.runMigrations();

		const userFactory: UserFactory = new UserFactory();
		const accountFactory: AccountFactory = new AccountFactory();
		// const transactionFactory: TransactionFactory = new TransactionFactory();
		// const transferFactory: TransferFactory = new TransferFactory();

		user1 = await userFactory.create({
			email: "user10@mail.com",
			name: "User #10",
		});

		mainAccount = await accountFactory.create({
			user_id: user1.id,
			name: "1 A Acc Origin"
		});
		secondaryAccount = await accountFactory.create({
			user_id: user1.id,
			name: "1 B Acc Destiny"
		});

		// transfer1 = await transferFactory.create({
		// 	description: "Transfer 1",
		// 	user_id: user1.id,
		// 	origin_acc_id: mainAccount.id,
		// 	destiny_acc_id: secondaryAccount.id,
		// 	amount: 100
		// });

		// transaction1_O = await transactionFactory.create({
		// 	account_id: mainAccount.id,
		// 	description: "Transfer from Acc Origin 1",
		// 	amount: 100,
		// 	type: "I",
		// 	transfer_id: transfer1.id
		// });

		// transaction1_D = await transactionFactory.create({
		// 	account_id: secondaryAccount.id,
		// 	description: "Transfer to Acc Destiny 1",
		// 	amount: -100,
		// 	type: "O",
		// 	transfer_id: transfer1.id
		// });

		user2 = await userFactory.create({
			email: "user20@mail.com",
			name: "User #20",
		});

		alternativeAccount1 = await accountFactory.create({
			user_id: user2.id,
			name: "2 A Acc Origin"
		});
		alternativeAccount2 = await accountFactory.create({
			user_id: user2.id,
			name: "2 B Acc Destiny"
		});

		// transfer2 = await transferFactory.create({
		// 	description: "Transfer 2",
		// 	user_id: user2.id,
		// 	origin_acc_id: alternativeAccount1.id,
		// 	destiny_acc_id: alternativeAccount2.id,
		// 	amount: 200
		// });

		// transaction2_O = await transactionFactory.create({
		// 	account_id: alternativeAccount1.id,
		// 	description: "Transfer from Acc Origin 2",
		// 	amount: 200,
		// 	type: "I",
		// 	transfer_id: transfer2.id
		// });

		// transaction2_D = await transactionFactory.create({
		// 	account_id: alternativeAccount2.id,
		// 	description: "Transfer to Acc Destiny 2",
		// 	amount: -200,
		// 	type: "O",
		// 	transfer_id: transfer2.id
		// });

	});

	afterAll(async () => {
		const connection = getConnection();
		// await connection.dropDatabase();
		await connection.close();
	});

	it("should be able return only accounts with at least one transaction", async () => {
		const response = await request(app)
			.get("/balance")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response.status).toBe(200);
		expect(response.body).toHaveLength(0);

	});

	it("should be able to add input values", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "1",
				type: "I",
				amount: 100,
				account_id: mainAccount.id,
				status: true
			});

		const response2 = await request(app)
			.get("/balance")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response2.status).toBe(200);
		expect(response2.body).toHaveLength(1);
		expect(response2.body[0].id).toBe(mainAccount.id);
		expect(response2.body[0].sum).toBe("100.00");

	});

	it("should be able to subtract output values", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "1",
				type: "O",
				amount: 200,
				account_id: mainAccount.id,
				status: true
			});

		const response2 = await request(app)
			.get("/balance")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response2.status).toBe(200);
		expect(response2.body).toHaveLength(1);
		expect(response2.body[0].id).toBe(mainAccount.id);
		expect(response2.body[0].sum).toBe("-100.00");

	});

	it("should not be able to return pending values", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "1",
				type: "O",
				amount: 200,
				account_id: mainAccount.id,
				status: false
			});

		const response2 = await request(app)
			.get("/balance")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response2.status).toBe(200);
		expect(response2.body).toHaveLength(1);
		expect(response2.body[0].id).toBe(mainAccount.id);
		expect(response2.body[0].sum).toBe("-100.00");

	});

	it("should not be able to return other accounts", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "1",
				type: "I",
				amount: 50,
				account_id: secondaryAccount.id,
				status: true
			});

		const response2 = await request(app)
			.get("/balance")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response2.status).toBe(200);
		expect(response2.body).toHaveLength(2);
		expect(response2.body[0].id).toBe(mainAccount.id);
		expect(response2.body[0].sum).toBe("-100.00");
		expect(response2.body[1].id).toBe(secondaryAccount.id);
		expect(response2.body[1].sum).toBe("50.00");
	});

	it("should not be able to return accounts of other user", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "1",
				type: "I",
				amount: 200,
				account_id: alternativeAccount1.id,
				status: true
			});

		const response2 = await request(app)
			.get("/balance")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response2.status).toBe(200);
		expect(response2.body).toHaveLength(2);
		expect(response2.body[0].id).toBe(mainAccount.id);
		expect(response2.body[0].sum).toBe("-100.00");
		expect(response2.body[1].id).toBe(secondaryAccount.id);
		expect(response2.body[1].sum).toBe("50.00");
	});

	it("should not be able to return pass transactions", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "1",
				type: "I",
				amount: 250,
				account_id: mainAccount.id,
				status: true,
				transaction_date: moment().subtract({ days: 5 }).toISOString()
			});

		const response2 = await request(app)
			.get("/balance")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response2.status).toBe(200);
		expect(response2.body).toHaveLength(2);
		expect(response2.body[0].id).toBe(mainAccount.id);
		expect(response2.body[0].sum).toBe("150.00");
		expect(response2.body[1].id).toBe(secondaryAccount.id);
		expect(response2.body[1].sum).toBe("50.00");
	});

	it("should not be able to return future transactions", async () => {
		const response = await request(app)
			.post("/transactions")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "1",
				type: "I",
				amount: 250,
				account_id: mainAccount.id,
				status: true,
				transaction_date: moment().add({ days: 5 }).toISOString()
			});

		const response2 = await request(app)
			.get("/balance")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response2.status).toBe(200);
		expect(response2.body).toHaveLength(2);
		expect(response2.body[0].id).toBe(mainAccount.id);
		expect(response2.body[0].sum).toBe("150.00");
		expect(response2.body[1].id).toBe(secondaryAccount.id);
		expect(response2.body[1].sum).toBe("50.00");
	});

	it("should not be able to consider future transactions", async () => {
		const response = await request(app)
			.post("/transfers")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`)
			.send({
				description: "1",
				amount: 250,
				origin_acc_id: mainAccount.id,
				destiny_acc_id: secondaryAccount.id,
			});

		const response2 = await request(app)
			.get("/balance")
			.set("Authorization", `Bearer ${jwt.sign({ id: user1.id }, process.env.APP_SECRET)}`);

		expect(response2.status).toBe(200);
		expect(response2.body).toHaveLength(2);
		expect(response2.body[0].id).toBe(mainAccount.id);
		expect(response2.body[0].sum).toBe("-100.00");
		expect(response2.body[1].id).toBe(secondaryAccount.id);
		expect(response2.body[1].sum).toBe("300.00");
	});

});
