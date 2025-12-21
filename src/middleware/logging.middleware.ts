import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  logger = new Logger('Response');
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body, query, params } = req;
    const reqTime = new Date().getTime();
    res.on('finish', () => {
      const statusCode = res.statusCode;
      const restTime = new Date().getTime();
      this.logger.log(`${method} ${originalUrl} ${statusCode} ${restTime - reqTime}ms`);
    });
    next();
  }
}
