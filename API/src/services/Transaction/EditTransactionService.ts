import { getRepository } from "typeorm";
import { Account } from "../../entities/Account";
import { Transaction } from "../../entities/Transaction";
import { User } from "../../entities/User";
import { isOwnerAccount } from "../../Helper/isOwnerAccount";

export class EditTransactionService {
	async execute({ id, description, type, amount, status, user_id, transaction_date }) {

		const repo = getRepository(Transaction);

		const transaction = await repo.findOne(id);

		if (!transaction) {
			return new Error("Transaction not found!");
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

		transaction.description = description ? description : transaction.description;
		transaction.type = type ? type : transaction.type;
		transaction.amount = amount ? amount : transaction.amount;
		transaction.status = status ? status : transaction.status;
		transaction.transaction_date = transaction_date ? transaction_date : transaction.transaction_date;

		await repo.save(transaction);

		return transaction;
	}
}
