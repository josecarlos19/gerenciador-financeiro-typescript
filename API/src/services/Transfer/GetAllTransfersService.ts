import { getRepository } from "typeorm";
import { Transfer } from "../../entities/Transfer";

export class getAllTransfersService {
	async execute(user_id) {

		const repo = getRepository(Transfer);

		const transfers = await repo.find({user_id: user_id});

		return transfers;

	}
}
