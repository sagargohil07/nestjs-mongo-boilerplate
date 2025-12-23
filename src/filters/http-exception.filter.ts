import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode: number;
    let code: string;
    let message: string;
    let data: any = {};

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // Handle different exception response formats
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message || 'An error occurred';
        
        // If there's additional error data, include it
        if (responseObj.error && Array.isArray(responseObj.message)) {
          data = { errors: responseObj.message };
        }
      } else {
        message = exception.message || 'An error occurred';
      }

      // Set code based on status code
      switch (statusCode) {
        case HttpStatus.BAD_REQUEST:
          code = 'BAD_REQUEST';
          message = message || 'Bad Request';
          break;
        case HttpStatus.UNAUTHORIZED:
          code = 'UNAUTHORIZED';
          message = message || 'Unauthorized';
          break;
        case HttpStatus.FORBIDDEN:
          code = 'FORBIDDEN';
          message = message || 'Forbidden';
          break;
        case HttpStatus.NOT_FOUND:
          code = 'NOT_FOUND';
          message = message || 'Not Found';
          break;
        case HttpStatus.CONFLICT:
          code = 'CONFLICT';
          message = message || 'Conflict';
          break;
        case HttpStatus.UNPROCESSABLE_ENTITY:
          code = 'VALIDATION_ERROR';
          message = message || 'Validation Error';
          break;
        default:
          code = 'ERROR';
          message = message || 'An error occurred';
      }
    } else {
      // Handle non-HTTP exceptions (Internal Server Error)
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      code = 'INTERNAL_SERVER_ERROR';
      message = exception instanceof Error ? exception.message : 'Internal Server Error';
      
      // Log the error for debugging (you can enhance this with a logger)
      console.error('Internal Server Error:', exception);
    }

    const errorResponse = {
      statusCode,
      code,
      message,
      data: Object.keys(data).length > 0 ? data : {},
    };

    response.status(statusCode).json(errorResponse);
  }
}
