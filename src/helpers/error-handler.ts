import { BadRequestException, HttpException } from '@nestjs/common';

export function handleServiceError(error: any): never {
  if (error instanceof BadRequestException) {
    throw new BadRequestException(error.message);
  }

  const statusCode = typeof error.getStatus === 'function' ? error.getStatus() || 500 : 500;
  const message = error.message ? error.message : 'Internal Server Error';
  throw new HttpException(message, statusCode);
}
