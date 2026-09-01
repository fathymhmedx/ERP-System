import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategories1788253536512 implements MigrationInterface {
  name = 'CreateCategories1788253536512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE "categories" (
      "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
      "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "deleted_at" TIMESTAMP WITH TIME ZONE,
      "name" character varying(100) NOT NULL,
      "description" text,
      CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b"
      PRIMARY KEY ("id")
    )
  `);

    await queryRunner.query(`
    CREATE UNIQUE INDEX "UQ_categories_name_active"
    ON "categories" (LOWER("name"))
    WHERE "deleted_at" IS NULL
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DROP INDEX "UQ_categories_name_active"
  `);

    await queryRunner.query(`
    DROP TABLE "categories"
  `);
  }
}
