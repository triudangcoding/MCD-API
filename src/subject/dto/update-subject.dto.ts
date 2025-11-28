import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateSubjectDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  facultyId?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

