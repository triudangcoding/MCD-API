import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';

@Injectable()
export class FacultyService {
  constructor(private prisma: PrismaService) {}

  async create(createFacultyDto: CreateFacultyDto) {
    return this.prisma.faculty.create({
      data: createFacultyDto,
    });
  }

  async findAll(branchId?: string) {
    const where: any = {};
    if (branchId) {
      where.branchId = branchId;
    }
    return this.prisma.faculty.findMany({
      where,
      include: {
        branch: true,
        subjects: true,
      },
    });
  }

  async findOne(id: string) {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id },
      include: {
        branch: true,
        subjects: true,
        teacherFaculties: true,
      },
    });

    if (!faculty) {
      throw new NotFoundException('Không tìm thấy khoa');
    }

    return faculty;
  }

  async update(id: string, updateFacultyDto: UpdateFacultyDto) {
    await this.findOne(id);
    return this.prisma.faculty.update({
      where: { id },
      data: updateFacultyDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.faculty.delete({ where: { id } });
    return { message: 'Xóa khoa thành công' };
  }
}
