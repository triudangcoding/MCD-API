import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateFacultyDto {
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
  branchId?: string;
}

