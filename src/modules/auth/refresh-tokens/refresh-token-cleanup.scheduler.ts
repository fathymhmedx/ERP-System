import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { RefreshTokensService } from './refresh-tokens.service';

@Injectable()
export class RefreshTokenCleanupScheduler {
  private readonly logger = new Logger(RefreshTokenCleanupScheduler.name);

  constructor(private readonly refreshTokensService: RefreshTokensService) {}

  /**
   * Delete expired refresh tokens every day at midnight.
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanup(): Promise<void> {
    try {
      const deleted = await this.refreshTokensService.deleteExpiredTokens();
      this.logger.log(`Deleted ${deleted} expired refresh token sessions.`);
    } catch (error) {
      this.logger.error(
        'Failed to delete expired refresh token sessions.',
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
