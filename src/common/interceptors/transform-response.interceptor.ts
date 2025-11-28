import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
  message?: string;
  meta?: any;
}

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        // Nếu response đã có format chuẩn rồi thì trả về nguyên
        if (data && typeof data === 'object' && 'data' in data) {
          return data;
        }

        return {
          data,
          message: 'Success',
        };
      }),
    );
  }
}

