import { Exclude } from 'class-transformer';

export class EmployeeResponseDto {
  id: number;
  empId: string;
  name: string;
  email: string;
  phone?: string;
  personalMobileNumber: string;
  personalEmail?: string;
  
  @Exclude()
  password: string;
  
  gender: string;
  religion: string;
  dob: Date;
  designation: string;
  department: string;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<EmployeeResponseDto>) {
    Object.assign(this, partial);
  }
}
