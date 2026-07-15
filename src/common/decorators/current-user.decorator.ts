import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from '../interfaces/auth-request.interface';
import { AuthUser } from '../interfaces/auth-user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return request.user;
  },
);
