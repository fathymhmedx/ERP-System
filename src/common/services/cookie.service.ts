import { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ENV } from 'src/config/env.constants';
import { AUTH_CONSTANTS } from 'src/modules/auth/constants/auth.constants';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  setRefreshTokenCookie(response: Response, refreshToken: string): void {
    const ttlDays = this.configService.getOrThrow<number>(
      ENV.REFRESH_TOKEN_TTL_DAYS,
    );

    response.cookie(
      this.configService.getOrThrow<string>(ENV.COOKIE_NAME),
      refreshToken,
      {
        httpOnly: true,
        secure:
          this.configService.getOrThrow<string>(ENV.COOKIE_SECURE) === 'true',
        sameSite: this.configService.getOrThrow<'strict' | 'lax' | 'none'>(
          ENV.COOKIE_SAME_SITE,
        ),
        maxAge: ttlDays * 24 * 60 * 60 * 1000,
        path: AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_PATH,
      },
    );
  }

  clearRefreshTokenCookie(response: Response): void {
    response.clearCookie(
      this.configService.getOrThrow<string>(ENV.COOKIE_NAME),
      {
        httpOnly: true,
        secure:
          this.configService.getOrThrow<string>(ENV.COOKIE_SECURE) === 'true',
        sameSite: this.configService.getOrThrow<'strict' | 'lax' | 'none'>(
          ENV.COOKIE_SAME_SITE,
        ),
        path: AUTH_CONSTANTS.REFRESH_TOKEN_COOKIE_PATH,
      },
    );
  }
}
