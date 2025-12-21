import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;

    return next.handle().pipe(
      map((data) => {
        // If data is already in the expected format, return as is
        if (data && typeof data === 'object' && 'statusCode' in data && 'code' in data) {
          return data;
        }

        // Determine code and message based on status code
        let code = 'SUCCESS';
        let message = 'Success';

        if (statusCode >= 200 && statusCode < 300) {
          code = 'SUCCESS';
          message = 'Success';
        }

        return {
          statusCode,
          code,
          message,
          data: data || {},
        };
      }),
    );
  }
}
