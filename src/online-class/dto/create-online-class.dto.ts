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

export class CreateOnlineClassDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  code: string;

  @IsUUID()
  teacherId: string;

  @IsUUID()
  subjectId: string;

  @IsUUID()
  branchId: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxStudent?: number = 50;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  status?: ClassStatus;
}

