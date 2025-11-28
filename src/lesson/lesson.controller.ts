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
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  create(
    @Body() createLessonDto: CreateLessonDto,
    @CurrentUser() user: any,
  ) {
    return this.lessonService.create(createLessonDto, user.id, user.role);
  }

  @Get('class/:classId')
  findAll(@Param('classId') classId: string) {
    return this.lessonService.findAll(classId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lessonService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
    @CurrentUser() user: any,
  ) {
    return this.lessonService.update(id, updateLessonDto, user.id, user.role);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.lessonService.remove(id, user.id, user.role);
  }
}

