import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1761207597843 implements MigrationInterface {
    name = 'InitialSchema1761207597843'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employees" ("id" SERIAL NOT NULL, "empId" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "phone" character varying(20), "personal_mobile_number" character varying(20) NOT NULL, "password" character varying(255) NOT NULL, "gender" character varying(10) NOT NULL, "religion" character varying(50) NOT NULL, "dob" date NOT NULL, "designation" character varying(100) NOT NULL, "department" character varying(100) NOT NULL, "image" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_940a206dda21410c6965108b8bd" UNIQUE ("empId"), CONSTRAINT "UQ_765bc1ac8967533a04c74a9f6af" UNIQUE ("email"), CONSTRAINT "PK_b9535a98350d5b26e7eb0c26af4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_EMPLOYEE_EMPID" ON "employees" ("empId") `);
        await queryRunner.query(`CREATE INDEX "IDX_EMPLOYEE_NAME" ON "employees" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_EMPLOYEE_EMAIL" ON "employees" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_EMPLOYEE_EMAIL"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_EMPLOYEE_NAME"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_EMPLOYEE_EMPID"`);
        await queryRunner.query(`DROP TABLE "employees"`);
    }

}
