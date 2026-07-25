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
import { RefreshToken } from './refresh-tokens/entities/refresh-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokensRepository } from './refresh-tokens/refresh-tokens.repository';
import { RefreshTokensService } from './refresh-tokens/refresh-tokens.service';
import { CookieService } from 'src/common/services/cookie.service';
import { RefreshTokenCleanupScheduler } from './refresh-tokens/refresh-token-cleanup.scheduler';

@Module({
  imports: [
    RolesModule,
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([RefreshToken]),

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
  providers: [
    AuthService,
    RefreshTokensRepository,
    RefreshTokensService,
    CookieService,
    JwtStrategy,
    JwtAuthGuard,
    RefreshTokenCleanupScheduler,
  ],
  exports: [JwtAuthGuard],
})
export class AuthModule {}
