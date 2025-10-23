import { 
  IsString, 
  IsEmail, 
  IsNotEmpty, 
  IsOptional, 
  IsEnum, 
  IsDateString,
  MinLength,
  MaxLength,
  Matches,
  IsBoolean
} from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  empId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @Matches(/^[\d\s\-\+\(\)]+$/, { 
    message: 'Phone number must contain only digits, spaces, and valid phone characters' 
  })
  phone?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @Matches(/^[\d\s\-\+\(\)]+$/, { 
    message: 'Personal mobile number must contain only digits, spaces, and valid phone characters' 
  })
  personalMobileNumber: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  personalEmail?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(255)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
  })
  password: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  religion: string;

  @IsDateString()
  @IsNotEmpty()
  dob: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  designation: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  department: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  image?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
