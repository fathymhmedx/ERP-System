import { AuthUser } from '../../../common/interfaces/auth/auth-user.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../../../common/interfaces/auth/jwt-payload.interface';
import { ENV } from 'src/config/env.constants';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>(ENV.JWT_SECRET_KEY),
    });
  }

  validate(payload: JwtPayload): AuthUser {
    return {
      id: payload.sub,
      roleId: payload.roleId,
    };
  }
}
