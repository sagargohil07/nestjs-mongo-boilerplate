import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PASSPORT_STRATEGIES, PUBLIC_ROUTE } from 'src/helpers/constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard(PASSPORT_STRATEGIES.JWT) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(PUBLIC_ROUTE, context.getHandler());

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
