import { getRepository } from "typeorm";
import { Account } from "../../entities/Account";
import { Transaction } from "../../entities/Transaction";
import { Transfer } from "../../entities/Transfer";
import { User } from "../../entities/User";
import { isOwnerAccount } from "../../Helper/isOwnerAccount";

type TranferRequest = {
  description: string,
  user_id: string,
  origin_acc_id: string,
  destiny_acc_id: string,
  amount: number
}

export class CreateTransferService {
	async execute({ description, user_id, origin_acc_id, destiny_acc_id, amount }: TranferRequest): Promise<Transfer | Error> {

		const repo = getRepository(Transfer);

		if ((!description) || (!user_id) || (!origin_acc_id) || (!destiny_acc_id) || (!amount)) {
			return new Error("Missing data to create a Transfer");
		}

		if (origin_acc_id == destiny_acc_id) {
			return new Error("Cant do tranfers in the same account");
		}

		if ((!getRepository(Account).findOne({ id: origin_acc_id }))
      || (!getRepository(Account).findOne({ id: destiny_acc_id }))
      || (!getRepository(User).findOne({ id: user_id }))) {
			return new Error("Invalid data");
		}

		const accs = await getRepository(Account).createQueryBuilder("account")
			.where("account.id IN (:...accIds)", { accIds: [origin_acc_id, destiny_acc_id]})
			.getRawMany();

		for await (const acc of accs) {
			if (!(await isOwnerAccount(user_id, acc.account_user_id))) {
				return new Error("Permission Denied");
			}
		}

		const transfer = repo.create({
			description: description,
			user_id: user_id,
			origin_acc_id: origin_acc_id,
			destiny_acc_id: destiny_acc_id,
			amount: amount
		});

		await repo.save(transfer);

		const transaction_O = getRepository(Transaction).create({
			description: `Transfer to account ${transfer.destiny_acc_id}`,
			amount: transfer.amount * -1,
			type: "O",
			account_id: transfer.origin_acc_id,
			transfer_id: transfer.id,
			status: true
		});

		const transaction_I = getRepository(Transaction).create({
			description: `Transfer from account ${transfer.origin_acc_id}`,
			amount: transfer.amount,
			type: "I",
			account_id: transfer.destiny_acc_id,
			transfer_id: transfer.id,
			status: true
		});

		await getRepository(Transaction).save(transaction_O);
		await getRepository(Transaction).save(transaction_I);

		return transfer;

	}
}
