import { IsString, IsDateString, IsInt, IsOptional, IsUUID } from 'class-validator';

export class UpdateTeacherCalendarDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsUUID()
  @IsOptional()
  onlineClassId?: string;
}

