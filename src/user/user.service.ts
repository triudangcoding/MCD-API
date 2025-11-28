import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Role } from '../common/enums/role.enum';
import { UserStatus } from '../common/enums/user-status.enum';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, ...rest } = createUserDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...rest,
        email,
        passwordHash,
      },
      include: {
        branch: true,
      },
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findAll(
    paginationDto: PaginationDto,
    filters?: {
      role?: Role;
      branchId?: string;
      status?: string;
      keyword?: string;
    },
  ) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'DESC' } =
      paginationDto;

    const where: Prisma.UserWhereInput = {};

    if (filters?.role) {
      where.role = filters.role;
    }

    if (filters?.branchId) {
      where.branchId = filters.branchId;
    }

    if (filters?.status) {
      where.status = filters.status as any;
    }

    if (filters?.keyword) {
      where.fullName = {
        contains: filters.keyword,
      };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          branch: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order.toLowerCase() as 'asc' | 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((user) => {
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { branch: true },
    });

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    // Kiểm tra email nếu có thay đổi
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }

    // Hash password mới nếu có
    const updateData: any = { ...updateUserDto };
    if (updateUserDto.password) {
      updateData.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      delete updateData.password;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      include: { branch: true },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }
    await this.prisma.user.delete({ where: { id } });
    return { message: 'Xóa user thành công' };
  }

  async toggleStatus(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    // Chuyển đổi status: ACTIVE -> INACTIVE -> BANNED -> ACTIVE
    let newStatus: string;
    if (user.status === 'ACTIVE') {
      newStatus = 'INACTIVE';
    } else if (user.status === 'INACTIVE') {
      newStatus = 'BANNED';
    } else {
      newStatus = 'ACTIVE';
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status: newStatus as any },
      include: { branch: true },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async updateStatus(id: string, status: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Không tìm thấy user');
    }

    // Validate status
    if (!Object.values(UserStatus).includes(status as UserStatus)) {
      throw new BadRequestException('Status không hợp lệ');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status: status as UserStatus },
      include: { branch: true },
    });

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async getUsersByBranch(branchId: string, paginationDto: PaginationDto) {
    return this.findAll(paginationDto, { branchId });
  }

  async getStatisticsByBranch(branchId?: string) {
    const where: Prisma.UserWhereInput = {};
    if (branchId) {
      where.branchId = branchId;
    }

    const users = await this.prisma.user.findMany({ where });
    const total = users.length;

    const stats = {
      total,
      admins: users.filter((u) => u.role === Role.ADMIN).length,
      teachers: users.filter((u) => u.role === Role.TEACHER).length,
      students: users.filter((u) => u.role === Role.USER).length,
    };

    return stats;
  }
}
