import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

@Injectable()
export class PaginationInterceptor<T>
  implements NestInterceptor<T, PaginatedResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginatedResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;

    return next.handle().pipe(
      map((data) => {
        // Nếu data đã có format pagination rồi
        if (data && Array.isArray(data.data) && data.meta) {
          return {
            ...data,
            meta: {
              ...data.meta,
              page,
              limit,
              totalPages: Math.ceil(data.meta.total / limit),
            },
          };
        }

        // Nếu data là array và có total
        if (Array.isArray(data) && data.length > 0) {
          // Giả sử có total trong metadata (cần service trả về đúng format)
          const total = (data as any).total || data.length;
          return {
            data: data.filter((item) => !item.total), // Loại bỏ total nếu có trong array
            meta: {
              total,
              page,
              limit,
              totalPages: Math.ceil(total / limit),
            },
            message: 'Success',
          };
        }

        return {
          data: Array.isArray(data) ? data : [data],
          meta: {
            total: Array.isArray(data) ? data.length : 1,
            page,
            limit,
            totalPages: 1,
          },
          message: 'Success',
        };
      }),
    );
  }
}

