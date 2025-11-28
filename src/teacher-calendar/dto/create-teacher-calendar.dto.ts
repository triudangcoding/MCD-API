import { IsString, IsInt, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateTeacherCalendarDto {
  @IsUUID()
  @IsOptional()
  teacherId?: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsUUID()
  @IsOptional()
  onlineClassId?: string;
}

