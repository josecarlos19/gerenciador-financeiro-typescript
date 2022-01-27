import { createConnection } from "../../src/database";
import { getConnection, getRepository } from "typeorm";
import * as Faker from "faker";
import { User } from "../../src/entities/User";
import bcrypt = require("bcrypt");

describe("User", () => {

	beforeAll(async () => {
		const connection = await createConnection();
		await connection.runMigrations();
	});

	afterAll(async () => {
		const connection = getConnection();
		await connection.dropDatabase();
		await connection.close();
	});

	it("should encrypt password", async () => {
		const password = Faker.internet.password();

		const repo = getRepository(User);
		const user = repo.create({
			name: Faker.name.findName(),
			email: Faker.internet.email(),
			password: password
		});

		await repo.save(user);

		const compareHash = await bcrypt.compare(password, user.password);

		expect(compareHash).toBe(true);

	});
});
