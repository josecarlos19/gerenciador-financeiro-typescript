import { User } from "../src/entities/User";
import { Account } from "../src/entities/Account";
import * as faker from "faker";
import { Factory } from "@linnify/typeorm-factory";
import { Transaction } from "../src/entities/Transaction";
import { Transfer } from "../src/entities/Transfer";
export class UserFactory extends Factory<User> {
	entity = User;

	name = `${faker.name.findName()}`;
	email = `${faker.internet.email()}`;
	password = `${faker.internet.password()}`;
}

export class AccountFactory extends Factory<Account> {
	entity = Account;

	name = `${faker.company.companyName()}`;
	user_id = 123;
}

const typesFunction = () => {
	const types = ["I", "O"];
	const random = Math.floor(Math.random() * types.length);
	return types[random];
};
export class TransactionFactory extends Factory<Transaction> {
	entity = Transaction;

	description = `${faker.database.engine()}`;
	type = `${typesFunction()}`;
	amount = `${faker.finance.amount()}`;
	status = false;
	account_id = 123;
	transfer_id = null;
}

export class TransferFactory extends Factory<Transfer> {
	entity = Transfer;
	
	description = `${faker.database.engine()}`;
	amount = `${faker.finance.amount()}`;
	user_id = 123;
	origin_acc_id = 123;
	destiny_acc_id = 123;
}
