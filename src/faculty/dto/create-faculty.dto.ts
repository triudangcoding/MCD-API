import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateFacultyDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  code: string;

  @IsString()
  @IsOptional()
  branchId?: string;
}

