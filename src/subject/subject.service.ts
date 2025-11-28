import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: CreateSubjectDto) {
    return this.prisma.subject.create({
      data: createSubjectDto,
    });
  }

  async findAll(facultyId?: string) {
    const where: any = {};
    if (facultyId) {
      where.facultyId = facultyId;
    }
    return this.prisma.subject.findMany({
      where,
      include: {
        faculty: true,
      },
    });
  }

  async findOne(id: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        faculty: true,
        classes: true,
        teacherSubjects: true,
      },
    });

    if (!subject) {
      throw new NotFoundException('Không tìm thấy môn học');
    }

    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    await this.findOne(id);
    return this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.subject.delete({ where: { id } });
    return { message: 'Xóa môn học thành công' };
  }
}
