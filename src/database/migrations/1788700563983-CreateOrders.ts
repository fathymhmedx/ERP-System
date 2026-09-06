import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrders1788700563983 implements MigrationInterface {
  name = 'CreateOrders1788700563983';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE SEQUENCE "orders_number_seq"
    START WITH 1
    INCREMENT BY 1
  `);

    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('pending', 'confirmed', 'completed', 'cancelled')`,
    );

    await queryRunner.query(
      `CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,

        "order_number" character varying(30) NOT NULL,
        "customer_id" uuid NOT NULL,
        "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending',
        "subtotal" numeric(12,2) NOT NULL DEFAULT '0',
        "discount" numeric(12,2) NOT NULL DEFAULT '0',
        "total" numeric(12,2) NOT NULL DEFAULT '0',
        "notes" text,

        CONSTRAINT "PK_orders_id"
          PRIMARY KEY ("id"),

        CONSTRAINT "UQ_orders_order_number"
          UNIQUE ("order_number"),

        CONSTRAINT "FK_orders_customer"
          FOREIGN KEY ("customer_id")
          REFERENCES "customers"("id")
          ON DELETE RESTRICT
          ON UPDATE NO ACTION
      )`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_orders_customer_id"
       ON "orders" ("customer_id")`,
    );

    await queryRunner.query(
      `CREATE INDEX "IDX_orders_status"
       ON "orders" ("status")`,
    );

    await queryRunner.query(
      `ALTER TABLE "orders"
       ADD CONSTRAINT "CHK_orders_subtotal_non_negative"
       CHECK ("subtotal" >= 0)`,
    );

    await queryRunner.query(
      `ALTER TABLE "orders"
       ADD CONSTRAINT "CHK_orders_discount_non_negative"
       CHECK ("discount" >= 0)`,
    );

    await queryRunner.query(
      `ALTER TABLE "orders"
       ADD CONSTRAINT "CHK_orders_total_non_negative"
       CHECK ("total" >= 0)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "orders"
       DROP CONSTRAINT "CHK_orders_total_non_negative"`,
    );

    await queryRunner.query(
      `ALTER TABLE "orders"
       DROP CONSTRAINT "CHK_orders_discount_non_negative"`,
    );

    await queryRunner.query(
      `ALTER TABLE "orders"
       DROP CONSTRAINT "CHK_orders_subtotal_non_negative"`,
    );

    await queryRunner.query(
      `ALTER TABLE "orders"
       DROP CONSTRAINT "FK_orders_customer"`,
    );

    await queryRunner.query(`DROP INDEX "public"."IDX_orders_status"`);

    await queryRunner.query(`DROP INDEX "public"."IDX_orders_customer_id"`);

    await queryRunner.query(`DROP TABLE "orders"`);

    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(`
  DROP SEQUENCE "orders_number_seq"
`);
  }
}
