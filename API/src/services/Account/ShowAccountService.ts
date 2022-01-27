import { getRepository } from "typeorm";
import { Account } from "../../entities/Account";
import { isOwnerAccount } from "../../Helper/isOwnerAccount";

export class ShowAccountService {
	async execute(User_id: string,id: string) {

		const repo = getRepository(Account);

		const account = await repo.findOne(id);

		if (!account) {
			return new Error("Account does not exists");
		}

		if (await isOwnerAccount(User_id, account.user_id) == false) {
			return new Error("Permission Denied");
		}
		
		return account;

	}
}
