import { createHash, randomBytes } from 'crypto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ENV } from 'src/config/env.constants';
import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { AUTH_CONSTANTS } from '../constants/auth.constants';
import { User } from 'src/modules/users/entities/user.entity';
import { DataSource } from 'typeorm';
import { CreateSessionResult, RotateSessionResult } from './interfaces';

@Injectable()
export class RefreshTokensService {
  constructor(
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Generate cryptographically secure refresh token.
   */
  generateToken(): string {
    return randomBytes(AUTH_CONSTANTS.REFRESH_TOKEN_BYTES).toString('hex');
  }

  /**
   * Create SHA-256 hash for refresh token.
   */
  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Calculate refresh token expiration date.
   */
  private getExpirationDate(): Date {
    const expiresAt = new Date();

    expiresAt.setDate(
      expiresAt.getDate() +
        this.configService.getOrThrow<number>(ENV.REFRESH_TOKEN_TTL_DAYS),
    );

    return expiresAt;
  }

  /**
   * Build refresh token entity before persisting.
   */
  private buildSession(user: User): {
    entity: RefreshToken;
    refreshToken: string;
  } {
    const refreshToken = this.generateToken();

    const tokenHash = this.hashToken(refreshToken);

    const entity = this.refreshTokensRepository.create({
      tokenHash,
      expiresAt: this.getExpirationDate(),
      user,
    });

    return {
      entity,
      refreshToken,
    };
  }
  /**
   * Create new refresh session
   */
  async createSession(user: User): Promise<CreateSessionResult> {
    const { entity, refreshToken } = this.buildSession(user);

    await this.refreshTokensRepository.save(entity);

    return {
      refreshToken,
    };
  }

  /**
   * Validate refresh token
   */
  async validateSession(refreshToken: string): Promise<RefreshToken> {
    const tokenHash = this.hashToken(refreshToken);

    const session =
      await this.refreshTokensRepository.findActiveByHash(tokenHash);

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return session;
  }

  /**
   * Revoke a refresh token session.
   */
  async revokeSession(id: string): Promise<void> {
    await this.refreshTokensRepository.revoke(id);
  }

  /**
   * Revoke all refresh sessions for a user.
   */
  async revokeAllByUser(userId: string): Promise<void> {
    await this.refreshTokensRepository.revokeAllByUser(userId);
  }

  /**
   * Update last usage timestamp.
   */
  async updateLastUsedAt(id: string): Promise<void> {
    await this.refreshTokensRepository.updateLastUsed(id);
  }

  /**
   * Remove expired refresh token sessions.
   */
  async deleteExpiredTokens(): Promise<void> {
    await this.refreshTokensRepository.deleteExpiredTokens();
  }

  /**
   * Rotate refresh token session atomically.
   */
  async rotateSession(refreshToken: string): Promise<RotateSessionResult> {
    const session = await this.validateSession(refreshToken);

    const { entity, refreshToken: newRefreshToken } = this.buildSession(
      session.user,
    );

    await this.dataSource.transaction(async (manager) => {
      await this.refreshTokensRepository.revokeWithManager(manager, session.id);

      await this.refreshTokensRepository.createWithManager(manager, entity);
    });

    return {
      user: session.user,
      refreshToken: newRefreshToken,
    };
  }
}
