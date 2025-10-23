import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRefreshTokenToEmployee1761212578112 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employees" 
            ADD COLUMN "refresh_token" character varying(500)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employees" 
            DROP COLUMN "refresh_token"
        `);
    }

}
