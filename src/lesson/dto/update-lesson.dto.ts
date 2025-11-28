import { IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { LessonType } from '../../common/enums/lesson-type.enum';

export class UpdateLessonDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(LessonType)
  @IsOptional()
  type?: LessonType;
}

