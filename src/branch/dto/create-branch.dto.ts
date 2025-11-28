import { IsString, MinLength, IsOptional } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  code: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

