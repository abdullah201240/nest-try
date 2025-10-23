import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  HttpCode, 
  HttpStatus,
  ParseIntPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto, EmployeeResponseDto } from './dto';
import { JwtOrApiKeyGuard } from '../auth/guards/jwt-or-api-key.guard';

@Controller('employees')
@UseInterceptors(ClassSerializerInterceptor)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    return await this.employeeService.create(createEmployeeDto);
  }

  @Get()
  @UseGuards(JwtOrApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<EmployeeResponseDto[]> {
    return await this.employeeService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtOrApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<EmployeeResponseDto> {
    return await this.employeeService.findOne(id);
  }
}
