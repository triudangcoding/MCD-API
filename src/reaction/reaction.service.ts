import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReactionDto } from './dto/create-reaction.dto';

@Injectable()
export class ReactionService {
  constructor(private prisma: PrismaService) {}

  async toggle(createReactionDto: CreateReactionDto, userId: string) {
    const existing = await this.prisma.reaction.findUnique({
      where: {
        postId_userId: {
          postId: createReactionDto.postId,
          userId: userId,
        },
      },
    });

    if (existing) {
      // Nếu đã có reaction và cùng type thì xóa, khác type thì update
      if (existing.type === createReactionDto.type) {
        await this.prisma.reaction.delete({
          where: {
            postId_userId: {
              postId: createReactionDto.postId,
              userId: userId,
            },
          },
        });
        return { message: 'Đã bỏ reaction', reaction: null };
      } else {
        return this.prisma.reaction.update({
          where: {
            postId_userId: {
              postId: createReactionDto.postId,
              userId: userId,
            },
          },
          data: { type: createReactionDto.type },
        });
      }
    }

    // Tạo mới
    return this.prisma.reaction.create({
      data: {
        ...createReactionDto,
        userId,
      },
    });
  }

  async findAll(postId: string) {
    return this.prisma.reaction.findMany({
      where: { postId },
      include: {
        user: true,
      },
    });
  }

  async remove(postId: string, userId: string) {
    const reaction = await this.prisma.reaction.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (!reaction) {
      throw new BadRequestException('Không tìm thấy reaction');
    }

    await this.prisma.reaction.delete({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });
    return { message: 'Xóa reaction thành công' };
  }
}
