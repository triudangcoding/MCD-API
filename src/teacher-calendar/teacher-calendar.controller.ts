import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TeacherCalendarService } from './teacher-calendar.service';
import { CreateTeacherCalendarDto } from './dto/create-teacher-calendar.dto';
import { UpdateTeacherCalendarDto } from './dto/update-teacher-calendar.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('teacher-calendars')
@UseGuards(JwtAuthGuard)
export class TeacherCalendarController {
  constructor(private readonly teacherCalendarService: TeacherCalendarService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  create(
    @Body() createTeacherCalendarDto: CreateTeacherCalendarDto,
    @CurrentUser() user: any,
  ) {
    return this.teacherCalendarService.create(
      createTeacherCalendarDto,
      user.id,
      user.role,
    );
  }

  @Get()
  findAll(
    @Query('teacherId') teacherId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.teacherCalendarService.findAll(
      teacherId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teacherCalendarService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  update(
    @Param('id') id: string,
    @Body() updateTeacherCalendarDto: UpdateTeacherCalendarDto,
    @CurrentUser() user: any,
  ) {
    return this.teacherCalendarService.update(
      id,
      updateTeacherCalendarDto,
      user.id,
      user.role,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.TEACHER)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.teacherCalendarService.remove(id, user.id, user.role);
  }
}

