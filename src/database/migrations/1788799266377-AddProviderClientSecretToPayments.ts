import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProviderClientSecretToPayments1788799266377 implements MigrationInterface {
  name = 'AddProviderClientSecretToPayments1788799266377';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" ADD "provider_client_secret" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payments" DROP COLUMN "provider_client_secret"`,
    );
  }
}
