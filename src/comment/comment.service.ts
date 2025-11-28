import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    return this.prisma.comment.create({
      data: {
        ...createCommentDto,
        authorId: userId,
      },
      include: {
        author: true,
      },
    });
  }

  async findAll(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        author: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: {
        author: true,
        post: true,
      },
    });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    return comment;
  }

  async update(id: string, updateCommentDto: UpdateCommentDto, userId: string, userRole: Role) {
    const comment = await this.findOne(id);

    // Chỉ người tạo hoặc admin mới được sửa
    if (userRole !== Role.ADMIN && comment.authorId !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa bình luận này');
    }

    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const comment = await this.findOne(id);

    // Chỉ người tạo hoặc admin mới được xóa
    if (userRole !== Role.ADMIN && comment.authorId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    await this.prisma.comment.delete({ where: { id } });
    return { message: 'Xóa bình luận thành công' };
  }
}
