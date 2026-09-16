import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvoices1789524670239 implements MigrationInterface {
  name = 'CreateInvoices1789524670239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE SEQUENCE "invoices_number_seq"
      START WITH 1
      INCREMENT BY 1
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."invoices_status_enum"
      AS ENUM('issued', 'cancelled')
    `);

    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),

        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,

        "invoice_number" character varying(30) NOT NULL,

        "order_id" uuid NOT NULL,
        "payment_id" uuid NOT NULL,
        "customer_id" uuid NOT NULL,

        "customer_name" character varying(201) NOT NULL,
        "customer_email" character varying(255),
        "customer_phone" character varying(20) NOT NULL,
        "customer_address" text,

        "subtotal" numeric(12,2) NOT NULL,
        "discount" numeric(12,2) NOT NULL,
        "total" numeric(12,2) NOT NULL,

        "currency" character varying(3) NOT NULL DEFAULT 'EGP',

        "status" "public"."invoices_status_enum"
          NOT NULL DEFAULT 'issued',

        "issued_at" TIMESTAMP WITH TIME ZONE NOT NULL,

        CONSTRAINT "PK_invoices_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "UQ_invoices_invoice_number"
          UNIQUE ("invoice_number"),

        CONSTRAINT "UQ_invoices_order_id"
          UNIQUE ("order_id"),

        CONSTRAINT "FK_invoices_order"
          FOREIGN KEY ("order_id")
          REFERENCES "orders"("id")
          ON DELETE RESTRICT
          ON UPDATE NO ACTION,

        CONSTRAINT "FK_invoices_payment"
          FOREIGN KEY ("payment_id")
          REFERENCES "payments"("id")
          ON DELETE RESTRICT
          ON UPDATE NO ACTION,

        CONSTRAINT "FK_invoices_customer"
          FOREIGN KEY ("customer_id")
          REFERENCES "customers"("id")
          ON DELETE RESTRICT
          ON UPDATE NO ACTION,

        CONSTRAINT "CHK_invoices_subtotal_non_negative"
          CHECK ("subtotal" >= 0),

        CONSTRAINT "CHK_invoices_discount_non_negative"
          CHECK ("discount" >= 0),

        CONSTRAINT "CHK_invoices_total_non_negative"
          CHECK ("total" >= 0)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_invoices_customer_id"
      ON "invoices" ("customer_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_invoices_payment_id"
      ON "invoices" ("payment_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_invoices_status"
      ON "invoices" ("status")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "public"."IDX_invoices_status"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_invoices_payment_id"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_invoices_customer_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "invoices"
      DROP CONSTRAINT "CHK_invoices_total_non_negative"
    `);

    await queryRunner.query(`
      ALTER TABLE "invoices"
      DROP CONSTRAINT "CHK_invoices_discount_non_negative"
    `);

    await queryRunner.query(`
      ALTER TABLE "invoices"
      DROP CONSTRAINT "CHK_invoices_subtotal_non_negative"
    `);

    await queryRunner.query(`
      ALTER TABLE "invoices"
      DROP CONSTRAINT "FK_invoices_customer"
    `);

    await queryRunner.query(`
      ALTER TABLE "invoices"
      DROP CONSTRAINT "FK_invoices_payment"
    `);

    await queryRunner.query(`
      ALTER TABLE "invoices"
      DROP CONSTRAINT "FK_invoices_order"
    `);

    await queryRunner.query(`
      DROP TABLE "invoices"
    `);

    await queryRunner.query(`
      DROP TYPE "public"."invoices_status_enum"
    `);

    await queryRunner.query(`
      DROP SEQUENCE "invoices_number_seq"
    `);
  }
}
