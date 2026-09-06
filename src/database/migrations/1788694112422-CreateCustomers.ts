import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCustomers1788694112422 implements MigrationInterface {
  name = 'CreateCustomers1788694112422';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "first_name" character varying(100) NOT NULL,
        "last_name" character varying(100) NOT NULL,
        "email" character varying(255),
        "phone" character varying(20) NOT NULL,
        "address" text,
        CONSTRAINT "PK_customers_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_customers_email_active"
      ON "customers" (LOWER("email"))
      WHERE "deleted_at" IS NULL
        AND "email" IS NOT NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_customers_phone"
      ON "customers" ("phone")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_customers_name"
      ON "customers" ("last_name", "first_name")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_customers_name"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_customers_phone"
    `);

    await queryRunner.query(`
      DROP INDEX "UQ_customers_email_active"
    `);

    await queryRunner.query(`
      DROP TABLE "customers"
    `);
  }
}
