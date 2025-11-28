import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateBranchDto {
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
  address?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

