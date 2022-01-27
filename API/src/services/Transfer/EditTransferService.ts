import { getRepository } from "typeorm";
import { Account } from "../../entities/Account";
import { Transaction } from "../../entities/Transaction";
import { Transfer } from "../../entities/Transfer";
import { isOwnerAccount } from "../../Helper/isOwnerAccount";

export class EditTransferService {
	async execute({ id ,description, user_id, origin_acc_id, destiny_acc_id, amount }) {

		const repo = getRepository(Transfer);

		const transfer = await repo.findOne({id: id});

		if (!transfer) {
			return new Error("Transfer does not exists");
		}

		if(!(await isOwnerAccount(user_id, transfer.user_id))){
			return new Error("Permission Denied");
		}

		await getRepository(Transaction).delete({account_id: transfer.origin_acc_id});
		await getRepository(Transaction).delete({ account_id: transfer.destiny_acc_id });

		transfer.description = description ? description : transfer.description;
		transfer.user_id = user_id ? user_id : transfer.user_id;
		transfer.origin_acc_id = origin_acc_id ? origin_acc_id : transfer.origin_acc_id;
		transfer.destiny_acc_id = destiny_acc_id ? destiny_acc_id : transfer.destiny_acc_id;
		transfer.amount = amount ? amount : transfer.amount;

		await repo.save(transfer);

		const transaction_O = getRepository(Transaction).create({
			description: `Transfer to account ${transfer.destiny_acc_id}`,
			amount: transfer.amount * -1,
			type: "O",
			account_id: transfer.origin_acc_id,
			transfer_id: transfer.id
		});

		const transaction_I = getRepository(Transaction).create({
			description: `Transfer from account ${transfer.origin_acc_id}`,
			amount: transfer.amount,
			type: "I",
			account_id: transfer.destiny_acc_id,
			transfer_id: transfer.id
		});

		await getRepository(Transaction).save(transaction_O);
		await getRepository(Transaction).save(transaction_I);

		return transfer;

	}
}
