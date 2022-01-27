import { getManager, getRepository } from "typeorm";
import { Account } from "../../entities/Account";
import { Transaction } from "../../entities/Transaction";
import { User } from "../../entities/User";
import moment from "moment";

export class GetBalanceService {
	async execute(user_id) {

		const queryBalance = await getRepository(Account).createQueryBuilder("a")
			.select("a.id", "id")
			.addSelect("SUM(t.amount)", "sum")
			.innerJoin(Transaction, "t", "t.account_id = a.id")
			.innerJoin(User, "u", "u.id = a.user_id")
			.groupBy("a.id")
			.orderBy("a.name", "ASC")
			.where(`t.transaction_date <= '${moment().toISOString()}'`)
			.andWhere("a.user_id = :id", { id: user_id })
			.andWhere("t.status = :bool", { bool: true })
			.getRawMany();

		return queryBalance;

	}
}
