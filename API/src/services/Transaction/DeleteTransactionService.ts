import { getRepository } from "typeorm";
import { Account } from "../../entities/Account";
import { Transaction } from "../../entities/Transaction";
import { User } from "../../entities/User";
import { isOwnerAccount } from "../../Helper/isOwnerAccount";

export class DeleteTransactionService {
	async execute(id: string, user_id: string) {

		const repo = getRepository(Transaction);
		const transaction = await repo.findOne(id);

		if (!transaction) {
			return new Error("Transaction does not exists");
		}
    
		const user = await getRepository(User).createQueryBuilder("user")
			.select("user.id")
			.innerJoin(Account, "account", "account.user_id = user.id")
			.innerJoin(Transaction, "transaction", "transaction.account_id = account.id")
			.where("transaction.id = :id", { id: id })
			.getOne();

		if (await isOwnerAccount(user_id, user.id) == false) {
			return new Error("Permission Denied");
		}

		await repo.delete(id);

	}
}
