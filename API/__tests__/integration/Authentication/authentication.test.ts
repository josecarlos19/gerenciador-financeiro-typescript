import { app } from "../../../src/app";
import request from "supertest";
import { createConnection } from "../../../src/database";
import { getConnection } from "typeorm";
import * as Faker from "faker";
import jwt = require("jsonwebtoken");
import {UserFactory} from "../../factories";
import { User } from "../../../src/entities/User";

describe("Authentication", () => {

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

	it("should be able to authenticate with valid credentials", async () => {

		const password = Faker.internet.password();
		const userFactory: UserFactory = new UserFactory();

		const user : User = await userFactory.create({
			password: password
		});

		const response = await request(app)
			.post("/sessions")
			.send({
				email: user.email,
				password: password
			});

		expect(response.status).toBe(200);
	});

	it("should not be able to authenticate with invalid credentials", async () => {
		const userFactory: UserFactory = new UserFactory();
		const user: User = await userFactory.create();

		const response = await request(app)
			.post("/sessions")
			.send({
				email: user.email,
				password: "invalidPassword"
			});

		expect(response.status).toBe(400);
	});

	it("should return JWT token when authenticaded", async () => {
		const password = Faker.internet.password();
		const userFactory: UserFactory = new UserFactory();

		const user: User = await userFactory.create({
			password: password
		});

		const response = await request(app)
			.post("/sessions")
			.send({
				email: user.email,
				password: password
			});

		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty("token");
	});

	it("should not be able to access a private route without JWT token", async () => {

		const userFactory: UserFactory = new UserFactory();

		const user: User = await userFactory.create();

		const response = await request(app)
			.post("/accounts")
			.send({
				name: Faker.company.companyName(),
				user_id: user.id,
			});

		expect(response.status).toBe(401);

	});

	it("should be able to access a private route with JWT token", async () => {
		const userFactory: UserFactory = new UserFactory();

		const user: User = await userFactory.create();

		const response = await request(app)
			.post("/accounts")
			.set("Authorization", `Bearer ${jwt.sign({ id: user.id }, process.env.APP_SECRET)}`)
			.send({
				name: Faker.company.companyName(),
				user_id: user.id,
			});

		expect(response.status).toBe(200);

	});

	it("should not be able to access private routes with invalid jwt token", async () => {
		const userFactory: UserFactory = new UserFactory();

		const user: User = await userFactory.create();

		const response = await request(app)
			.post("/accounts")
			.set("Authorization", "Bearer InvalidToken0123")
			.send({
				name: Faker.company.companyName(),
				user_id: user.id,
			});

		expect(response.status).toBe(401);

	});

});
