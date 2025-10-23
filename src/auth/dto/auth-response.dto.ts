import { EmployeeResponseDto } from '../../employee/dto';

export class AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  employee: EmployeeResponseDto;
  expiresIn: number;

  constructor(partial: Partial<AuthResponseDto>) {
    Object.assign(this, partial);
  }
}
