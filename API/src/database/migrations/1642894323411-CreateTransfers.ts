import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateTransfers1642894323411 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "transfers",
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
						name: "amount",
						type: "decimal",
						precision: 15,
						scale: 2,
						isNullable: false,
					},
					{
						name: "origin_acc_id",
						type: "uuid",
						isNullable: false
					},
					{
						name: "destiny_acc_id",
						type: "uuid",
						isNullable: false
					},
					{
						name: "user_id",
						type: "uuid",
						isNullable: false
					},
					{
						name: "created_at",
						type: "timestamp",
						default: "now()"
					},
				],
				foreignKeys: [
					{
						name: "fk_origin_transfers_account",
						columnNames: ["origin_acc_id"],
						referencedTableName: "accounts",
						referencedColumnNames: ["id"]
					},
					{
						name: "fk_destiny_transfers_account",
						columnNames: ["destiny_acc_id"],
						referencedTableName: "accounts",
						referencedColumnNames: ["id"]
					},
					{
						name: "fk_transfers_user",
						columnNames: ["user_id"],
						referencedTableName: "users",
						referencedColumnNames: ["id"]
					}
				]
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("transfers");
	}

}
