import { IsString, IsEnum, IsOptional } from 'class-validator';
import { PostType } from '../../common/enums/post-type.enum';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsEnum(PostType)
  @IsOptional()
  type?: PostType;
}

