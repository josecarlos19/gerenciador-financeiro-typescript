import { getRepository } from "typeorm";
import { Account } from "../../entities/Account";
import { Transaction } from "../../entities/Transaction";
import { isOwnerAccount } from "../../Helper/isOwnerAccount";

export class DeleteAccountService {
	async execute(id: string, user_id: string) {

		const repo = getRepository(Account);

		const account = await repo.findOne(id);

		if (!account) {
			return new Error("Account does not exists");
		}

		if (await isOwnerAccount(user_id, account.user_id) == false) {
			return new Error("Permission Denied");
		}

		const transactionsLinkeds = await getRepository(Transaction).createQueryBuilder("transaction")
			.innerJoin(Account, "account", "account.id = transaction.account_id")
			.where("account.id = :id", { id: id })
			.getCount();

		if (transactionsLinkeds > 0) {
			return new Error("Cant delete accounts with transactions associates");
		}

		await repo.delete(id);
	}
}
