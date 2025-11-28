import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { CreateReactionDto } from './dto/create-reaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('reactions')
@UseGuards(JwtAuthGuard)
export class ReactionController {
  constructor(private readonly reactionService: ReactionService) {}

  @Post('toggle')
  toggle(@Body() createReactionDto: CreateReactionDto, @CurrentUser() user: any) {
    return this.reactionService.toggle(createReactionDto, user.id);
  }

  @Get('post/:postId')
  findAll(@Param('postId') postId: string) {
    return this.reactionService.findAll(postId);
  }

  @Delete('post/:postId')
  remove(@Param('postId') postId: string, @CurrentUser() user: any) {
    return this.reactionService.remove(postId, user.id);
  }
}

