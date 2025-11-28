import { IsString, IsEnum, IsOptional } from 'class-validator';
import { PostType } from '../../common/enums/post-type.enum';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  onlineClassId?: string;

  @IsString()
  content: string;

  @IsEnum(PostType)
  @IsOptional()
  type?: PostType;
}

