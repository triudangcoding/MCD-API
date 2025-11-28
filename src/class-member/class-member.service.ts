import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClassMemberStatus } from '../common/enums/class-member-status.enum';

@Injectable()
export class ClassMemberService {
  constructor(private prisma: PrismaService) {}

  async joinClass(userId: string, classId: string) {
    // Kiểm tra lớp có tồn tại không
    const onlineClass = await this.prisma.onlineClass.findUnique({
      where: { id: classId },
      include: { 
        members: true,
        _count: {
          select: { members: true }
        }
      },
    });

    if (!onlineClass) {
      throw new NotFoundException('Không tìm thấy lớp học');
    }

    // Kiểm tra đã join chưa
    const existing = await this.prisma.classMember.findFirst({
      where: { userId, onlineClassId: classId },
    });

    if (existing) {
      throw new BadRequestException('Bạn đã tham gia lớp này rồi');
    }

    // Kiểm tra số lượng học viên
    const approvedMembers = await this.prisma.classMember.count({
      where: {
        onlineClassId: classId,
        status: ClassMemberStatus.APPROVED,
      },
    });

    if (approvedMembers >= onlineClass.maxStudent) {
      throw new BadRequestException('Lớp đã đầy');
    }

    // Tạo request join
    return this.prisma.classMember.create({
      data: {
        userId,
        onlineClassId: classId,
        status: ClassMemberStatus.PENDING,
      },
    });
  }

  async getMyClasses(userId: string) {
    return this.prisma.classMember.findMany({
      where: { userId },
      include: {
        onlineClass: {
          include: {
            teacher: true,
            subject: true,
          },
        },
      },
    });
  }

  async leaveClass(userId: string, classId: string) {
    const member = await this.prisma.classMember.findFirst({
      where: { userId, onlineClassId: classId },
    });

    if (!member) {
      throw new NotFoundException('Bạn chưa tham gia lớp này');
    }

    await this.prisma.classMember.delete({ where: { id: member.id } });
    return { message: 'Rời lớp thành công' };
  }
}
