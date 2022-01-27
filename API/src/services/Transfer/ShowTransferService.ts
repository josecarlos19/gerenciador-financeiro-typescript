import { getRepository } from "typeorm";
import { Transfer } from "../../entities/Transfer";
import { isOwnerAccount } from "../../Helper/isOwnerAccount";

export class ShowTransferService {
	async execute(id, user_id) {

		const repo = getRepository(Transfer);

		const transfer = await repo.findOne({ id: id });

		if (!transfer) {
			return new Error("Transfer does not exists");
		}

		if (!(await isOwnerAccount(user_id, transfer.user_id))) {
			return new Error("Permission Denied");
		}

		return transfer;

	}
}
