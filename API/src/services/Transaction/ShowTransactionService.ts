import { getRepository } from "typeorm";
import { Account } from "../../entities/Account";
import { Transaction } from "../../entities/Transaction";
import { User } from "../../entities/User";
import { isOwnerAccount } from "../../Helper/isOwnerAccount";

export class ShowTransactionService {
	async execute(User_id: string, id: string) {

		const repo = getRepository(Transaction);
		const transaction = await repo.findOne(id);

		if (!transaction) {
			return new Error("Transaction does not exists");
		}

		const userFromId = await getRepository(User).createQueryBuilder("user")
			.select("user.id")
			.innerJoin(Account, "account", "account.user_id = user.id")
			.innerJoin(Transaction, "transaction", "transaction.account_id = account.id")
			.where("transaction.id = :id", { id: id })
			.getOne();

		if (await isOwnerAccount(User_id, userFromId.id) == false) {
			return new Error("Permission Denied");
		}

		return transaction;

	}
}
