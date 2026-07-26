import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { RefreshTokensService } from './refresh-tokens.service';
import { RefreshTokenCleanupScheduler } from './refresh-token-cleanup.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  providers: [
    RefreshTokensRepository,
    RefreshTokensService,
    RefreshTokenCleanupScheduler,
  ],
  exports: [RefreshTokensService],
})
export class RefreshTokensModule {}
