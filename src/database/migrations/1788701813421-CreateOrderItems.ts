import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderItems1788701813421 implements MigrationInterface {
  name = 'CreateOrderItems1788701813421';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,

        "order_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "quantity" integer NOT NULL,
        "unit_price" numeric(12,2) NOT NULL,
        "subtotal" numeric(12,2) NOT NULL,

        CONSTRAINT "PK_order_items_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "UQ_order_items_order_product"
          UNIQUE ("order_id", "product_id"),

        CONSTRAINT "FK_order_items_order"
          FOREIGN KEY ("order_id")
          REFERENCES "orders"("id")
          ON DELETE CASCADE
          ON UPDATE NO ACTION,

        CONSTRAINT "FK_order_items_product"
          FOREIGN KEY ("product_id")
          REFERENCES "products"("id")
          ON DELETE RESTRICT
          ON UPDATE NO ACTION,

        CONSTRAINT "CHK_order_items_quantity_positive"
          CHECK ("quantity" > 0),

        CONSTRAINT "CHK_order_items_unit_price_non_negative"
          CHECK ("unit_price" >= 0),

        CONSTRAINT "CHK_order_items_subtotal_non_negative"
          CHECK ("subtotal" >= 0)
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_order_items_order_id"
      ON "order_items" ("order_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_order_items_product_id"
      ON "order_items" ("product_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX "public"."IDX_order_items_product_id"
    `);

    await queryRunner.query(`
      DROP INDEX "public"."IDX_order_items_order_id"
    `);

    await queryRunner.query(`
      DROP TABLE "order_items"
    `);
  }
}
