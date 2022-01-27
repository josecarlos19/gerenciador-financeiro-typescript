import { getRepository } from "typeorm";
import { User } from "../../entities/User";

type UserRequest = {
	name: string;
	email: string;
	password: string;
}
export class CreateUserService {
	async execute({ name, email, password }: UserRequest): Promise<User | Error> {

		if (!name || !email || !password) {
			return new Error("Missing data to create a new User");
		}

		const repo = getRepository(User);

		if (await repo.findOne({ email })) {
			return new Error("User already exists!");
		}

		const user = repo.create({
			name,
			email,
			password
		});

		await repo.save(user);

		return user;
	}
}
