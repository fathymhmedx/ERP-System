import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProducts1788436058966 implements MigrationInterface {
  name = 'CreateProducts1788436058966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,

        "name" character varying(150) NOT NULL,
        "sku" character varying(100) NOT NULL,
        "description" text,

        "cost_price" numeric(12,2) NOT NULL,
        "selling_price" numeric(12,2) NOT NULL,

        "current_stock" integer NOT NULL DEFAULT 0,
        "reorder_level" integer NOT NULL DEFAULT 0,

        "category_id" uuid NOT NULL,
        "supplier_id" uuid NOT NULL,

        CONSTRAINT "PK_products"
          PRIMARY KEY ("id"),

        CONSTRAINT "FK_products_category"
          FOREIGN KEY ("category_id")
          REFERENCES "categories"("id")
          ON DELETE RESTRICT,

        CONSTRAINT "FK_products_supplier"
          FOREIGN KEY ("supplier_id")
          REFERENCES "suppliers"("id")
          ON DELETE RESTRICT,

        CONSTRAINT "CHK_products_cost_price_non_negative"
          CHECK ("cost_price" >= 0),

        CONSTRAINT "CHK_products_selling_price_non_negative"
          CHECK ("selling_price" >= 0),

        CONSTRAINT "CHK_products_current_stock_non_negative"
          CHECK ("current_stock" >= 0),

        CONSTRAINT "CHK_products_reorder_level_non_negative"
          CHECK ("reorder_level" >= 0)
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_products_sku_active"
      ON "products" (LOWER("sku"))
      WHERE "deleted_at" IS NULL
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_category_id"
      ON "products" ("category_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_products_supplier_id"
      ON "products" ("supplier_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "IDX_products_supplier_id"
    `);

    await queryRunner.query(`
      DROP INDEX "IDX_products_category_id"
    `);

    await queryRunner.query(`
      DROP INDEX "UQ_products_sku_active"
    `);

    await queryRunner.query(`
      DROP TABLE "products"
    `);
  }
}
