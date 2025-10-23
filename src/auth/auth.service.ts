import { 
  Injectable, 
  UnauthorizedException,
  ForbiddenException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from '../employee/emoloyee.entity';
import { AuthResponseDto } from './dto';
import { EmployeeResponseDto } from '../employee/dto';
import { CustomLoggerService } from '../common';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {
    this.logger.setContext('AuthService');
  }

  async validateEmployee(email: string, password: string): Promise<Employee | null> {
    this.logger.log(`Validating employee: ${email}`);
    
    const employee = await this.employeeRepository.findOne({
      where: { email },
    });

    if (!employee) {
      this.logger.warn(`Employee not found: ${email}`);
      return null;
    }

    // Check if employee is active
    if (!employee.isActive) {
      this.logger.warn(`Inactive account login attempt: ${email}`);
      throw new ForbiddenException('Your account is inactive. Please contact administrator.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    
    if (!isPasswordValid) {
      this.logger.warn(`Invalid password attempt for: ${email}`);
      return null;
    }

    this.logger.log(`Employee validated successfully: ${email}`);
    return employee;
  }

  async login(employee: Employee): Promise<AuthResponseDto> {
    this.logger.log(`Login request for employee: ${employee.email} (ID: ${employee.id})`);
    
    const payload = {
      email: employee.email,
      sub: employee.id,
      empId: employee.empId,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.generateRefreshToken(payload);

    // Hash and store refresh token
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.employeeRepository.update(employee.id, {
      refreshToken: hashedRefreshToken,
    });

    this.logger.log(`Login successful for employee: ${employee.email}`);

    return new AuthResponseDto({
      accessToken,
      refreshToken,
      employee: new EmployeeResponseDto(employee),
      expiresIn: 900, // 15 minutes in seconds
    });
  }

  async refreshTokens(employeeId: number, refreshToken: string): Promise<AuthResponseDto> {
    this.logger.log(`Refresh token request for employee ID: ${employeeId}`);
    
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee || !employee.refreshToken) {
      this.logger.warn(`Invalid refresh token attempt for employee ID: ${employeeId}`);
      throw new UnauthorizedException('Access Denied');
    }

    // Check if employee is active
    if (!employee.isActive) {
      this.logger.warn(`Inactive account refresh attempt for: ${employee.email}`);
      throw new ForbiddenException('Your account is inactive. Please contact administrator.');
    }

    // Verify refresh token
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      employee.refreshToken,
    );

    if (!refreshTokenMatches) {
      this.logger.warn(`Refresh token mismatch for employee ID: ${employeeId}`);
      throw new UnauthorizedException('Access Denied');
    }

    const payload = {
      email: employee.email,
      sub: employee.id,
      empId: employee.empId,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    const newRefreshToken = await this.generateRefreshToken(payload);

    // Hash and store new refresh token
    const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);
    await this.employeeRepository.update(employee.id, {
      refreshToken: hashedRefreshToken,
    });

    this.logger.log(`Tokens refreshed successfully for employee: ${employee.email}`);

    return new AuthResponseDto({
      accessToken,
      refreshToken: newRefreshToken,
      employee: new EmployeeResponseDto(employee),
      expiresIn: 900,
    });
  }

  async logout(employeeId: number): Promise<void> {
    this.logger.log(`Logout request for employee ID: ${employeeId}`);
    
    await this.employeeRepository.update(employeeId, {
      refreshToken: undefined,
    });
    
    this.logger.log(`Logout successful for employee ID: ${employeeId}`);
  }

  private async generateRefreshToken(payload: any): Promise<string> {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'your-refresh-secret-key';
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
    
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    } as any);
  }
}
