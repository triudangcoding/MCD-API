import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherCalendarDto } from './dto/create-teacher-calendar.dto';
import { UpdateTeacherCalendarDto } from './dto/update-teacher-calendar.dto';
import { Role } from '../common/enums/role.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class TeacherCalendarService {
  constructor(private prisma: PrismaService) {}

  async create(createTeacherCalendarDto: CreateTeacherCalendarDto, userId: string, userRole: Role) {
    // Chỉ teacher hoặc admin mới được tạo lịch
    if (userRole !== Role.ADMIN && userRole !== Role.TEACHER) {
      throw new ForbiddenException('Chỉ giáo viên mới được tạo lịch');
    }

    return this.prisma.teacherCalendar.create({
      data: {
        ...createTeacherCalendarDto,
        teacherId: createTeacherCalendarDto.teacherId || userId,
      },
      include: {
        teacher: true,
        onlineClass: true,
      },
    });
  }

  async findAll(teacherId?: string, startDate?: Date, endDate?: Date) {
    const where: Prisma.TeacherCalendarWhereInput = {};

    if (teacherId) {
      where.teacherId = teacherId;
    }

    if (startDate && endDate) {
      where.startTime = {
        gte: startDate,
        lte: endDate,
      };
    }

    return this.prisma.teacherCalendar.findMany({
      where,
      include: {
        teacher: true,
        onlineClass: true,
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findOne(id: string) {
    const calendar = await this.prisma.teacherCalendar.findUnique({
      where: { id },
      include: {
        teacher: true,
        onlineClass: true,
      },
    });

    if (!calendar) {
      throw new NotFoundException('Không tìm thấy lịch');
    }

    return calendar;
  }

  async update(id: string, updateTeacherCalendarDto: UpdateTeacherCalendarDto, userId: string, userRole: Role) {
    const calendar = await this.findOne(id);

    // Chỉ giáo viên sở hữu hoặc admin mới được sửa
    if (userRole !== Role.ADMIN && calendar.teacherId !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa lịch này');
    }

    return this.prisma.teacherCalendar.update({
      where: { id },
      data: updateTeacherCalendarDto,
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const calendar = await this.findOne(id);

    // Chỉ giáo viên sở hữu hoặc admin mới được xóa
    if (userRole !== Role.ADMIN && calendar.teacherId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa lịch này');
    }

    await this.prisma.teacherCalendar.delete({ where: { id } });
    return { message: 'Xóa lịch thành công' };
  }
}
