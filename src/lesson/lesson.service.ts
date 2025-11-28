import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class LessonService {
  constructor(private prisma: PrismaService) {}

  async create(createLessonDto: CreateLessonDto, userId: string, userRole: Role) {
    const onlineClass = await this.prisma.onlineClass.findUnique({
      where: { id: createLessonDto.onlineClassId },
      include: { teacher: true },
    });

    if (!onlineClass) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    // Chỉ teacher của lớp hoặc admin mới được tạo bài học
    if (userRole !== Role.ADMIN && onlineClass.teacherId !== userId) {
      throw new ForbiddenException('Bạn không có quyền tạo bài học cho lớp này');
    }

    return this.prisma.lesson.create({
      data: {
        ...createLessonDto,
        createdBy: userId,
      },
      include: {
        creator: true,
        files: true,
      },
    });
  }

  async findAll(classId: string) {
    return this.prisma.lesson.findMany({
      where: { onlineClassId: classId },
      include: {
        creator: true,
        files: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        creator: true,
        onlineClass: true,
        files: true,
      },
    });

    if (!lesson) {
      throw new NotFoundException('Không tìm thấy bài học');
    }

    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto, userId: string, userRole: Role) {
    const lesson = await this.findOne(id);

    // Chỉ người tạo hoặc admin mới được sửa
    if (userRole !== Role.ADMIN && lesson.createdBy !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa bài học này');
    }

    return this.prisma.lesson.update({
      where: { id },
      data: updateLessonDto,
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const lesson = await this.findOne(id);

    // Chỉ người tạo hoặc admin mới được xóa
    if (userRole !== Role.ADMIN && lesson.createdBy !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bài học này');
    }

    await this.prisma.lesson.delete({ where: { id } });
    return { message: 'Xóa bài học thành công' };
  }
}
