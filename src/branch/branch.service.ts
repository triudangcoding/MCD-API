import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';

@Injectable()
export class BranchService {
  constructor(private prisma: PrismaService) {}

  async create(createBranchDto: CreateBranchDto) {
    const existing = await this.prisma.branch.findUnique({
      where: { code: createBranchDto.code },
    });

    if (existing) {
      throw new ConflictException('Mã chi nhánh đã tồn tại');
    }

    return this.prisma.branch.create({
      data: createBranchDto,
    });
  }

  async findAll() {
    return this.prisma.branch.findMany();
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
      include: {
        users: true,
        faculties: true,
        classes: true,
      },
    });

    if (!branch) {
      throw new NotFoundException('Không tìm thấy chi nhánh');
    }

    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    const branch = await this.findOne(id);

    if (updateBranchDto.code && updateBranchDto.code !== branch.code) {
      const existing = await this.prisma.branch.findUnique({
        where: { code: updateBranchDto.code },
      });

      if (existing) {
        throw new ConflictException('Mã chi nhánh đã tồn tại');
      }
    }

    return this.prisma.branch.update({
      where: { id },
      data: updateBranchDto,
    });
  }

  async remove(id: string) {
    const branch = await this.findOne(id);
    await this.prisma.branch.delete({ where: { id } });
    return { message: 'Xóa chi nhánh thành công' };
  }
}
