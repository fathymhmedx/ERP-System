import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { COOKIE_KEYS } from '../constants/cookie.constants';
import { RequestCookies } from '../interfaces/request/request-cookies.interface';

export const RefreshToken = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const cookies = request.cookies as RequestCookies;

    return cookies[COOKIE_KEYS.REFRESH_TOKEN];
  },
);
