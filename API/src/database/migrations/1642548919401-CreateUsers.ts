import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1642548919401 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: "users",
				columns: [
					{
						name: "id",
						type: "uuid",
						isPrimary: true
					},
					{
						name: "email",
						type: "varchar",
						isUnique: true
					},
					{
						name: "name",
						type: "varchar"
					},
					{
						name:"password",
						type: "varchar"
					},
					{
						name: "created_at",
						type: "timestamp",
						default: "now()"
					},
				]
			})
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable("users");
	}

}
