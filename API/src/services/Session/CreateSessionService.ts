import { getRepository } from "typeorm";
import { User } from "../../entities/User";

type UserSession = {
	email: string;
	password: string;
}

export class CreateSessionService {
	async execute({ email, password }: UserSession) {

		const repo = getRepository(User);

		const user = await repo.findOne({ email });

		if (!user) {
			return new Error("User not found!");
		}

		if (!(await user.checkPassword(password))) {
			return new Error("Incorrect password!");
		}

		return user;
	}
}
