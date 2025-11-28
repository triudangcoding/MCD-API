import { IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { LessonType } from '../../common/enums/lesson-type.enum';

export class CreateLessonDto {
  @IsString()
  onlineClassId: string;

  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  content: string;

  @IsEnum(LessonType)
  @IsOptional()
  type?: LessonType;
}

