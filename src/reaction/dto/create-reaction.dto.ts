import { IsString, IsEnum } from 'class-validator';
import { ReactionType } from '../../common/enums/reaction-type.enum';

export class CreateReactionDto {
  @IsString()
  postId: string;

  @IsEnum(ReactionType)
  type: ReactionType;
}

