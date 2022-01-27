import { getRepository } from "typeorm";
import { Account } from "../../entities/Account";
import { User } from "../../entities/User";

type AccountRequest = {
	name: string,
	user_id: string
}

export class CreateAccountService {
	async execute({ name, user_id }: AccountRequest): Promise<Account | Error> {

		const repo = getRepository(Account);

		if ((!name) || (!user_id)) {
			return new Error("Missing data to create a Account");
		}

		const repoUser = getRepository(User);

		if (!await repoUser.findOne(user_id)) {
			return new Error("User does not exists");
		}

		const account = repo.create({ name, user_id });

		await repo.save(account);

		return account;
	}
}
