import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: any) {
    return this.commentService.create(createCommentDto, user.id);
  }

  @Get('post/:postId')
  findAll(@Param('postId') postId: string) {
    return this.commentService.findAll(postId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentService.update(id, updateCommentDto, user.id, user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.commentService.remove(id, user.id, user.role);
  }
}

