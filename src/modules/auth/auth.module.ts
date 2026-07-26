import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategies';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesModule } from '../roles/roles.module';
import { ENV } from 'src/config/env.constants';
import { CookieService } from 'src/common/services/cookie.service';
import { RefreshTokensModule } from './refresh-tokens/refresh-tokens.module';

@Module({
  imports: [
    RolesModule,
    ConfigModule,
    UsersModule,
    RefreshTokensModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.getOrThrow<string>(ENV.JWT_SECRET_KEY),
          signOptions: {
            expiresIn: configService.getOrThrow(ENV.JWT_EXPIRES_IN),
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CookieService, JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
