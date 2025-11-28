import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '../../common/enums/role.enum';

@Injectable()
export class BranchGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // ADMIN có quyền truy cập tất cả branch
    if (user.role === Role.ADMIN) {
      return true;
    }

    // Lấy branchId từ query hoặc body
    const branchId = request.query.branchId || request.body.branchId;

    // Nếu không có branchId trong request, cho phép (có thể là query không liên quan branch)
    if (!branchId) {
      return true;
    }

    // Kiểm tra user có thuộc branch này không (UUID string)
    if (user.branchId && user.branchId !== branchId) {
      throw new ForbiddenException(
        'Bạn không có quyền truy cập dữ liệu của chi nhánh này',
      );
    }

    return true;
  }
}

