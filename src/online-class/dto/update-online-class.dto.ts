import {
  IsString,
  MinLength,
  IsInt,
  IsDateString,
  IsOptional,
  Min,
  IsUUID,
} from 'class-validator';
import { ClassStatus } from '../../common/enums/class-status.enum';

export class UpdateOnlineClassDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  code?: string;

  @IsUUID()
  @IsOptional()
  teacherId?: string;

  @IsUUID()
  @IsOptional()
  subjectId?: string;

  @IsUUID()
  @IsOptional()
  branchId?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxStudent?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: ClassStatus;
}

