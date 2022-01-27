import { getRepository } from "typeorm";
import { Transaction } from "../../entities/Transaction";

export class GetAllTransactionsService {
	async execute(account_id) {

		const repo = getRepository(Transaction);

		const transactions = await repo.createQueryBuilder("transaction")
			.where("transaction.account_id = :id", {id: account_id})
			.getMany();

		return transactions;

	}
}
