import { getRepository } from "typeorm";
import { Account } from "../../entities/Account";
import { isOwnerAccount } from "../../Helper/isOwnerAccount";

type AccountSession = {
  id: string;
  name: string;
	user_id: string
}

export class EditAccountService {
	async execute({id, name, user_id}: AccountSession) {

		const repo = getRepository(Account);

		const account = await repo.findOne(id);

		if (!account) {
			return new Error("Account not found!");
		}

		if (await isOwnerAccount(user_id, account.user_id) == false) {
			return new Error("Permission Denied");
		}

		account.name = name ? name : account.name;

		await repo.save(account);

		return account;

	}
}
