import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UserStatus } from '../common/enums/user-status.enum';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Tìm user
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { branch: true },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Kiểm tra status
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Tài khoản đã bị khóa');
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo JWT token
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        branchId: user.branchId,
        branch: user.branch,
      },
      accessToken,
    };
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { branch: true },
    });

    if (!user || user.status !== UserStatus.ACTIVE) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      branchId: user.branchId,
      fullName: user.fullName,
    };
  }
}

