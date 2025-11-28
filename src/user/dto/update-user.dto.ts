import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';

export class UpdateUserDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  fullName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

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

