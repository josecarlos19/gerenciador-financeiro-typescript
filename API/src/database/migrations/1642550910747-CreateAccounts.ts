import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAccounts1642550910747 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "accounts",
				columns: [
					{
						name: "id",
						type: "uuid",
						isPrimary: true
					},
					{
						name: "name",
						type: "varchar",
						isNullable: false
					},
					{
						name: "user_id",
						type: "uuid",
					},
					{
						name: "created_at",
						type: "timestamp",
						default: "now()"
					},
				],
				foreignKeys: [
					{
						name: "fk_accounts_user",
						columnNames: ["user_id"],
						referencedTableName: "users",
						referencedColumnNames: ["id"]
					}
				]
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("accounts");
	}

}
