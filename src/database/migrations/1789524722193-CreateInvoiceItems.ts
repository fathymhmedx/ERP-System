import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInvoiceItems1789524722193 implements MigrationInterface {
  name = 'CreateInvoiceItems1789524722193';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "invoice_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),

        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,

        "invoice_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,

        "product_name" character varying(255) NOT NULL,

        "quantity" integer NOT NULL,

        "unit_price" numeric(12,2) NOT NULL,

        "subtotal" numeric(12,2) NOT NULL,

        CONSTRAINT "PK_invoice_items_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "UQ_invoice_items_invoice_product"
          UNIQUE ("invoice_id", "product_id"),

        CONSTRAINT "FK_invoice_items_invoice"
          FOREIGN KEY ("invoice_id")
          REFERENCES "invoices"("id")
          ON DELETE CASCADE
          ON UPDATE NO ACTION,

        CONSTRAINT "FK_invoice_items_product"
          FOREIGN KEY ("product_id")
          REFERENCES "products"("id")
          ON DELETE RESTRICT
          ON UPDATE NO ACTION,

        CONSTRAINT "CHK_invoice_items_quantity_positive"
          CHECK ("quantity" > 0),

        CONSTRAINT "CHK_invoice_items_unit_price_non_negative"
          CHECK ("unit_price" >= 0),

        CONSTRAINT "CHK_invoice_items_subtotal_non_negative"
          CHECK ("subtotal" >= 0)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_invoice_items_invoice_id"
      ON "invoice_items" ("invoice_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_invoice_items_product_id"
      ON "invoice_items" ("product_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "public"."IDX_invoice_items_product_id"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_invoice_items_invoice_id"
    `);

    await queryRunner.query(`
      DROP TABLE "invoice_items"
    `);
  }
}
