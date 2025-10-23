import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './emoloyee.entity';
import { CreateEmployeeDto, EmployeeResponseDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    try {
      // Check if employee with same empId or email already exists
      const existingEmployee = await this.employeeRepository.findOne({
        where: [
          { empId: createEmployeeDto.empId },
          { email: createEmployeeDto.email },
        ],
      });

      if (existingEmployee) {
        if (existingEmployee.empId === createEmployeeDto.empId) {
          throw new ConflictException('Employee ID already exists');
        }
        if (existingEmployee.email === createEmployeeDto.email) {
          throw new ConflictException('Email already exists');
        }
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(createEmployeeDto.password, 10);

      // Create employee entity
      const employee = this.employeeRepository.create({
        ...createEmployeeDto,
        password: hashedPassword,
        dob: new Date(createEmployeeDto.dob),
      });

      // Save to database
      const savedEmployee = await this.employeeRepository.save(employee);

      // Return response without password
      return new EmployeeResponseDto(savedEmployee);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create employee');
    }
  }

  async findAll(): Promise<EmployeeResponseDto[]> {
    const employees = await this.employeeRepository.find();
    return employees.map(employee => new EmployeeResponseDto(employee));
  }

  async findOne(id: number): Promise<EmployeeResponseDto> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new ConflictException('Employee not found');
    }
    return new EmployeeResponseDto(employee);
  }
}
