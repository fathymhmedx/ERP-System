import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePayments1788788431061 implements MigrationInterface {
  name = 'CreatePayments1788788431061';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."payments_provider_enum"
      AS ENUM('paymob')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."payments_method_enum"
      AS ENUM('card')
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."payments_status_enum"
      AS ENUM('pending', 'paid', 'failed', 'refunded')
    `);

    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),

        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,

        "order_id" uuid NOT NULL,
        "amount" numeric(12,2) NOT NULL,
        "currency" character varying(3) NOT NULL DEFAULT 'EGP',

        "provider" "public"."payments_provider_enum" NOT NULL,
        "method" "public"."payments_method_enum" NOT NULL,

        "status" "public"."payments_status_enum"
          NOT NULL DEFAULT 'pending',

        "provider_intention_id" character varying(100),
        "provider_order_id" character varying(100),
        "provider_transaction_id" character varying(100),

        "paid_at" TIMESTAMP WITH TIME ZONE,
        "failure_reason" text,

        "idempotency_key" character varying(100) NOT NULL,

        CONSTRAINT "PK_payments_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "FK_payments_order"
          FOREIGN KEY ("order_id")
          REFERENCES "orders"("id")
          ON DELETE RESTRICT
          ON UPDATE NO ACTION,

        CONSTRAINT "CHK_payments_amount_non_negative"
          CHECK ("amount" >= 0)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_payments_order_id"
      ON "payments" ("order_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_payments_status"
      ON "payments" ("status")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_payments_provider"
      ON "payments" ("provider")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_payments_idempotency_key"
      ON "payments" ("idempotency_key")
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_payments_provider_intention_id"
      ON "payments" ("provider_intention_id")
      WHERE "provider_intention_id" IS NOT NULL
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_payments_provider_transaction_id"
      ON "payments" ("provider_transaction_id")
      WHERE "provider_transaction_id" IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "public"."UQ_payments_provider_transaction_id"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."UQ_payments_provider_intention_id"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."UQ_payments_idempotency_key"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_payments_provider"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_payments_status"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_payments_order_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "payments"
      DROP CONSTRAINT "CHK_payments_amount_non_negative"
    `);

    await queryRunner.query(`
      ALTER TABLE "payments"
      DROP CONSTRAINT "FK_payments_order"
    `);

    await queryRunner.query(`
      DROP TABLE "payments"
    `);

    await queryRunner.query(`
      DROP TYPE "public"."payments_status_enum"
    `);

    await queryRunner.query(`
      DROP TYPE "public"."payments_method_enum"
    `);

    await queryRunner.query(`
      DROP TYPE "public"."payments_provider_enum"
    `);
  }
}
