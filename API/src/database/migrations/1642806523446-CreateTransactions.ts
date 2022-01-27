import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTransactions1642806523446 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "transactions",
				columns: [
					{
						name: "id",
						type: "uuid",
						isPrimary: true
					},
					{
						name: "description",
						type: "varchar",
						isNullable: false,

					},
					{
						name: "type",
						type: "enum",
						isNullable: false,
						enum: ["I", "O"],
					},
					{
						name: "amount",
						type: "decimal",
						precision: 15,
						scale: 2,
						isNullable: false,
					},
					{
						name: "status",
						type: "boolean",
						isNullable: false,
						default: false

					},
					{
						name: "account_id",
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
						name: "fk_transactions_account",
						columnNames: ["account_id"],
						referencedTableName: "accounts",
						referencedColumnNames: ["id"]
					}
				]
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("transactions");
	}

}
