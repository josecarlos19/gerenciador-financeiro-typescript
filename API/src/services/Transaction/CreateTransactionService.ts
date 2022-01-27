import { getRepository } from "typeorm";
import { Account } from "../../entities/Account";
import { Transaction } from "../../entities/Transaction";

export class CreateTransactionService {
	async execute({ description, type, amount, account_id, status, transaction_date }): Promise<Transaction | Error> {

		const repo = getRepository(Transaction);

		if ((!description )|| (!type) || (!amount) || (!account_id)) {
			return new Error("Missing data to create a Transaction");
		}

		if (!(type == "I" || type == "O")) {
			return new Error("Type not valid");
		}

		const repoAccount = getRepository(Account);

		if (!await repoAccount.findOne(account_id)) {
			return new Error("Account does not exists");
		}

		const transaction = repo.create({
			description,
			type,
			amount,
			account_id,
			status,
			transaction_date
		});

		await repo.save(transaction);

		return transaction;

	}
}
