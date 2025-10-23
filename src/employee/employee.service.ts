import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './emoloyee.entity';
import { CreateEmployeeDto, EmployeeResponseDto } from './dto';
import { CustomLoggerService } from '../common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('EmployeeService');
  }

  async create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    try {
      this.logger.log(`Creating new employee with empId: ${createEmployeeDto.empId}`);
      
      // Check if employee with same empId or email already exists
      const existingEmployee = await this.employeeRepository.findOne({
        where: [
          { empId: createEmployeeDto.empId },
          { email: createEmployeeDto.email },
        ],
      });

      if (existingEmployee) {
        if (existingEmployee.empId === createEmployeeDto.empId) {
          this.logger.warn(`Duplicate employee ID: ${createEmployeeDto.empId}`);
          throw new ConflictException('Employee ID already exists');
        }
        if (existingEmployee.email === createEmployeeDto.email) {
          this.logger.warn(`Duplicate email: ${createEmployeeDto.email}`);
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

      this.logger.log(`Employee created successfully - ID: ${savedEmployee.id}, empId: ${savedEmployee.empId}`);

      // Return response without password
      return new EmployeeResponseDto(savedEmployee);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(
        `Failed to create employee: ${error.message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to create employee');
    }
  }

  async findAll(): Promise<EmployeeResponseDto[]> {
    this.logger.log('Fetching all employees');
    
    const employees = await this.employeeRepository.find();
    
    this.logger.log(`Found ${employees.length} employees`);
    
    return employees.map(employee => new EmployeeResponseDto(employee));
  }

  async findOne(id: number): Promise<EmployeeResponseDto> {
    this.logger.log(`Fetching employee with ID: ${id}`);
    
    const employee = await this.employeeRepository.findOne({ where: { id } });
    
    if (!employee) {
      this.logger.warn(`Employee not found with ID: ${id}`);
      throw new ConflictException('Employee not found');
    }
    
    this.logger.log(`Employee found - ID: ${id}, empId: ${employee.empId}`);
    
    return new EmployeeResponseDto(employee);
  }
}
