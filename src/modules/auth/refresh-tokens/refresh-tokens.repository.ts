import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  FindOptionsSelect,
  IsNull,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class RefreshTokensRepository extends BaseRepository<RefreshToken> {
  private readonly tokenSelect: FindOptionsSelect<RefreshToken> = {
    id: true,
    tokenHash: true,
    expiresAt: true,
    revokedAt: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  };

  constructor(
    @InjectRepository(RefreshToken)
    repository: Repository<RefreshToken>,
  ) {
    super(repository);
  }

  async findActiveByHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.findOne({
      select: this.tokenSelect,
      where: {
        tokenHash,
        revokedAt: IsNull(),
        expiresAt: MoreThan(new Date()),
      },
      relations: {
        user: {
          role: true,
        },
      },
    });
  }
  async revoke(id: string): Promise<void> {
    await this.update(
      { id, revokedAt: IsNull() },
      {
        revokedAt: new Date(),
      },
    );
  }

  async revokeAllByUser(userId: string): Promise<void> {
    await this.update(
      {
        user: {
          id: userId,
        },
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );
  }

  async deleteExpiredTokens(): Promise<number> {
    const result = await this.repository.delete({
      expiresAt: LessThan(new Date()),
    });

    return result.affected ?? 0;
  }

  async createWithManager(
    manager: EntityManager,
    token: RefreshToken,
  ): Promise<RefreshToken> {
    return manager.save(RefreshToken, token);
  }

  async revokeWithManager(manager: EntityManager, id: string): Promise<void> {
    await manager.update(
      RefreshToken,
      {
        id,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );
  }
}
