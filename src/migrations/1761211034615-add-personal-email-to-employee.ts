import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPersonalEmailToEmployee1761211034615 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employees" 
            ADD COLUMN "personal_email" character varying(100)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employees" 
            DROP COLUMN "personal_email"
        `);
    }

}
