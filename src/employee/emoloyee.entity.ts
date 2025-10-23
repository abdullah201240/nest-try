import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  @Index('IDX_EMPLOYEE_EMPID')
  empId: string;

  @Column({ type: 'varchar', length: 100 })
  @Index('IDX_EMPLOYEE_NAME')
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  @Index('IDX_EMPLOYEE_EMAIL')
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 20, name: 'personal_mobile_number' })
  personalMobileNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'personal_email' })
  personalEmail: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 10 })
  gender: string;

  @Column({ type: 'varchar', length: 50 })
  religion: string;

  @Column({ type: 'date' })
  dob: Date;

  @Column({ type: 'varchar', length: 100 })
  designation: string;

  @Column({ type: 'varchar', length: 100 })
  department: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}