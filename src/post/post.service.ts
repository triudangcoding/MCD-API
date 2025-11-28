import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    return this.prisma.post.create({
      data: {
        ...createPostDto,
        authorId: userId,
      },
      include: {
        author: true,
        onlineClass: true,
      },
    });
  }

  async findAll(filters?: { onlineClassId?: string; type?: string }) {
    const where: any = {};

    if (filters?.onlineClassId) {
      where.onlineClassId = filters.onlineClassId;
    }

    if (filters?.type) {
      where.type = filters.type;
    }

    return this.prisma.post.findMany({
      where,
      include: {
        author: true,
        onlineClass: true,
        comments: true,
        reactions: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        onlineClass: true,
        comments: {
          include: {
            author: true,
          },
        },
        reactions: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Không tìm thấy bài đăng');
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string, userRole: Role) {
    const post = await this.findOne(id);

    // Chỉ người tạo hoặc admin mới được sửa
    if (userRole !== Role.ADMIN && post.authorId !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa bài đăng này');
    }

    return this.prisma.post.update({
      where: { id },
      data: updatePostDto,
    });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const post = await this.findOne(id);

    // Chỉ người tạo hoặc admin mới được xóa
    if (userRole !== Role.ADMIN && post.authorId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bài đăng này');
    }

    await this.prisma.post.delete({ where: { id } });
    return { message: 'Xóa bài đăng thành công' };
  }
}
