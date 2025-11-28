import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOnlineClassDto } from './dto/create-online-class.dto';
import { UpdateOnlineClassDto } from './dto/update-online-class.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ClassMemberStatus } from '../common/enums/class-member-status.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class OnlineClassService {
  constructor(private prisma: PrismaService) {}

  async create(createOnlineClassDto: CreateOnlineClassDto) {
    const existing = await this.prisma.onlineClass.findUnique({
      where: { code: createOnlineClassDto.code },
    });

    if (existing) {
      throw new BadRequestException('Mã lớp đã tồn tại');
    }

    return this.prisma.onlineClass.create({
      data: createOnlineClassDto,
    });
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: {
      branchId?: string;
      teacherId?: string;
      subjectId?: string;
      status?: string;
    },
  ) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'DESC' } =
      paginationDto;

    const where: Prisma.OnlineClassWhereInput = {};

    if (filters?.branchId) {
      where.branchId = filters.branchId;
    }

    if (filters?.teacherId) {
      where.teacherId = filters.teacherId;
    }

    if (filters?.subjectId) {
      where.subjectId = filters.subjectId;
    }

    if (filters?.status) {
      where.status = filters.status as any;
    }

    const [classes, total] = await Promise.all([
      this.prisma.onlineClass.findMany({
        where,
        include: {
          teacher: true,
          subject: true,
          branch: true,
          members: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order.toLowerCase() as 'asc' | 'desc' },
      }),
      this.prisma.onlineClass.count({ where }),
    ]);

    return {
      data: classes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const onlineClass = await this.prisma.onlineClass.findUnique({
      where: { id },
      include: {
        teacher: true,
        subject: true,
        branch: true,
        members: {
          include: {
            user: true,
          },
        },
        lessons: true,
        posts: true,
      },
    });

    if (!onlineClass) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    return onlineClass;
  }

  async update(id: string, updateOnlineClassDto: UpdateOnlineClassDto) {
    await this.findOne(id);
    return this.prisma.onlineClass.update({
      where: { id },
      data: updateOnlineClassDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.onlineClass.delete({ where: { id } });
    return { message: 'Xóa lớp học thành công' };
  }

  async getMembers(classId: string) {
    return this.prisma.classMember.findMany({
      where: { onlineClassId: classId },
      include: { user: true },
    });
  }

  async approveMember(classId: string, memberId: string) {
    const member = await this.prisma.classMember.findFirst({
      where: { id: memberId, onlineClassId: classId },
    });

    if (!member) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }

    return this.prisma.classMember.update({
      where: { id: memberId },
      data: { status: ClassMemberStatus.APPROVED },
    });
  }

  async rejectMember(classId: string, memberId: string) {
    const member = await this.prisma.classMember.findFirst({
      where: { id: memberId, onlineClassId: classId },
    });

    if (!member) {
      throw new NotFoundException('Không tìm thấy thành viên');
    }

    return this.prisma.classMember.update({
      where: { id: memberId },
      data: { status: ClassMemberStatus.REJECTED },
    });
  }
}
