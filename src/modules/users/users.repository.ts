import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      relations: {
        role: true,
      },
      select: {
        id: true,
        email: true,
        password: true,
        isVerified: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
        role: {
          id: true,
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email });
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.update(
      { id },
      {
        lastLoginAt: new Date(),
      },
    );
  }

  async markAsVerified(id: string): Promise<void> {
    await this.update(
      { id },
      {
        isVerified: true,
      },
    );
  }
}
