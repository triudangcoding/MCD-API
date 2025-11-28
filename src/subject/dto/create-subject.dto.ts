import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  code: string;

  @IsString()
  facultyId: string;

  @IsString()
  @IsOptional()
  description?: string;
}

