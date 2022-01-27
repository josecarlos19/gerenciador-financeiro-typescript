import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTranderIDToTransaction1642900993122 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("ALTER TABLE transactions ADD transfer_id uuid REFERENCES transfers (id);");
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("ALTER TABLE transactions DROP COLUMN transfer_id;");
	}

}
