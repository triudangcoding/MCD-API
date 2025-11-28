import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @IsOptional()
  branchId?: string;

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus;

  @IsString()
  @IsOptional()
  avatar?: string;
}

