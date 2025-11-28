import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFileResourceDto } from './dto/create-file-resource.dto';

@Injectable()
export class FileResourceService {
  constructor(private prisma: PrismaService) {}

  async create(createFileResourceDto: CreateFileResourceDto, userId: string) {
    return this.prisma.fileResource.create({
      data: {
        ...createFileResourceDto,
        uploaderId: userId,
      },
      include: {
        uploader: true,
        onlineClass: true,
        lesson: true,
      },
    });
  }

  async findAll(filters?: {
    onlineClassId?: string;
    lessonId?: string;
    uploaderId?: string;
  }) {
    const where: any = {};

    if (filters?.onlineClassId) {
      where.onlineClassId = filters.onlineClassId;
    }

    if (filters?.lessonId) {
      where.lessonId = filters.lessonId;
    }

    if (filters?.uploaderId) {
      where.uploaderId = filters.uploaderId;
    }

    return this.prisma.fileResource.findMany({
      where,
      include: {
        uploader: true,
        onlineClass: true,
        lesson: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const fileResource = await this.prisma.fileResource.findUnique({
      where: { id },
      include: {
        uploader: true,
        onlineClass: true,
        lesson: true,
      },
    });

    if (!fileResource) {
      throw new NotFoundException('Không tìm thấy file');
    }

    return fileResource;
  }

  async remove(id: string, userId: string) {
    const fileResource = await this.findOne(id);

    // Chỉ người upload hoặc admin mới được xóa
    if (fileResource.uploaderId !== userId) {
      throw new NotFoundException('Bạn không có quyền xóa file này');
    }

    await this.prisma.fileResource.delete({ where: { id } });
    return { message: 'Xóa file thành công' };
  }
}
