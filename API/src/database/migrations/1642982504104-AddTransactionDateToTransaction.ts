import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTransactionDateToTransaction1642982504104 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("ALTER TABLE transactions ADD transaction_date timestamp DEFAULT NOW();");
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("ALTER TABLE transactions DROP COLUMN transaction_date;");
	}

}
