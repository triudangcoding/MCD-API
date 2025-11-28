import { IsString, IsOptional } from 'class-validator';

export class CreateFileResourceDto {
  @IsString()
  @IsOptional()
  onlineClassId?: string;

  @IsString()
  @IsOptional()
  lessonId?: string;

  @IsString()
  fileName: string;

  @IsString()
  fileUrl: string;

  @IsString()
  fileType: string;

  @IsString()
  @IsOptional()
  description?: string;
}

