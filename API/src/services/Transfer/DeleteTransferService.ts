import { getRepository } from "typeorm";
import { Transaction } from "../../entities/Transaction";
import { Transfer } from "../../entities/Transfer";
import { isOwnerAccount } from "../../Helper/isOwnerAccount";

export class DeleteTransferService {
	async execute(id, user_id) {

		const repo = getRepository(Transfer);

		const transfer =  await repo.findOne({id: id});

		if (!transfer) {

			return new Error("Transfer does not exists");
		}

		if (!(await isOwnerAccount(transfer.user_id, user_id))) {
			return new Error("Permission Denied");
		}

		await getRepository(Transaction).delete({ account_id: transfer.origin_acc_id });
		await getRepository(Transaction).delete({ account_id: transfer.destiny_acc_id });
		await repo.delete(transfer);

	}
}
