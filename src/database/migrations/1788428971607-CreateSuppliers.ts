import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSuppliers1788428971607 implements MigrationInterface {
  name = 'CreateSuppliers1788428971607';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "suppliers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "name" character varying(150) NOT NULL,
        "email" character varying(255),
        "phone" character varying(30) NOT NULL,
        "address" text,
        "contact_person" character varying(150),
        CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e"
        PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_suppliers_name_active"
      ON "suppliers" (LOWER("name"))
      WHERE "deleted_at" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "UQ_suppliers_name_active"
    `);

    await queryRunner.query(`
      DROP TABLE "suppliers"
    `);
  }
}
