import { getRepository } from "typeorm";
import { User } from "../../entities/User";

type UserSession = {
  id: string;
  name: string;
  email: string;
  password: string;
}

export class EditUserService {
	async execute({ id, name, email, password }: UserSession) {

		const repo = getRepository(User);

		const user = await repo.findOne(id);

		if (!user) {
			return new Error("User not found!");
		}

		user.name = name ? name : user.name;
		user.email = email ? email : user.email;
		user.password = password ? password : user.password;

		await repo.save(user);

		return user;

	}
}
