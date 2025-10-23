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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateEmployee(email: string, password: string): Promise<Employee | null> {
    const employee = await this.employeeRepository.findOne({
      where: { email },
    });

    if (!employee) {
      return null;
    }

    // Check if employee is active
    if (!employee.isActive) {
      throw new ForbiddenException('Your account is inactive. Please contact administrator.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    
    if (!isPasswordValid) {
      return null;
    }

    return employee;
  }

  async login(employee: Employee): Promise<AuthResponseDto> {
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

    return new AuthResponseDto({
      accessToken,
      refreshToken,
      employee: new EmployeeResponseDto(employee),
      expiresIn: 900, // 15 minutes in seconds
    });
  }

  async refreshTokens(employeeId: number, refreshToken: string): Promise<AuthResponseDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id: employeeId },
    });

    if (!employee || !employee.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    // Check if employee is active
    if (!employee.isActive) {
      throw new ForbiddenException('Your account is inactive. Please contact administrator.');
    }

    // Verify refresh token
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      employee.refreshToken,
    );

    if (!refreshTokenMatches) {
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

    return new AuthResponseDto({
      accessToken,
      refreshToken: newRefreshToken,
      employee: new EmployeeResponseDto(employee),
      expiresIn: 900,
    });
  }

  async logout(employeeId: number): Promise<void> {
    await this.employeeRepository.update(employeeId, {
      refreshToken: undefined,
    });
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
