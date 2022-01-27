import { getRepository } from "typeorm";
import { Account } from "../../entities/Account";

export class GetAllAccountsService {
	async execute(user_id){

		const repo = getRepository(Account);

		const accounts = await repo.createQueryBuilder("account")
			.where("account.user_id = :id", {id: user_id})
			.getMany();

		return accounts;

	}
}
