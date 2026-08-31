import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLeaveExclusionConstraint1725097200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS btree_gist;`);
    await queryRunner.query(`
      ALTER TABLE "leaves" ADD CONSTRAINT "leaves_no_overlapping_active_leave"
      EXCLUDE USING gist (
        employee_id WITH =,
        daterange(start_date, end_date, '[]') WITH &&
      )
      WHERE (status NOT IN ('rejected', 'cancelled') AND deleted_at IS NULL);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "leaves" DROP CONSTRAINT "leaves_no_overlapping_active_leave";
    `);
  }
}
