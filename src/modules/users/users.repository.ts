import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { User } from './entities/user.entity';
import { FindOptionsSelect, ILike, Repository } from 'typeorm';
import { GetUsersQueryDto } from './dto';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(
    @InjectRepository(User)
    repository: Repository<User>,
  ) {
    super(repository);
  }

  private readonly authSelect: FindOptionsSelect<User> = {
    id: true,
    email: true,
    password: true,
    isVerified: true,
    isActive: true,
    lastLoginAt: true,
    createdAt: true,
    updatedAt: true,
  };

  /**
   * Find all users with their roles.
   */
  async findAllWithRole(query: GetUsersQueryDto): Promise<[User[], number]> {
    const { page, limit, search, role, isActive } = query;

    return this.repository.findAndCount({
      relations: {
        role: true,
      },

      where: {
        ...(search && {
          email: ILike(`%${search}%`),
        }),

        ...(role && {
          role: {
            name: role,
          },
        }),

        ...(isActive !== undefined && {
          isActive,
        }),
      },

      skip: (page - 1) * limit,

      take: limit,

      order: {
        createdAt: 'DESC',
      },
    });
  }

  /**
   * Find user by id with role.
   */
  async findByIdWithRole(id: string): Promise<User | null> {
    return this.findById(id, {
      relations: {
        role: true,
      },
    });
  }

  /**
   * Find user by email including password for authentication.
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email },
      relations: {
        role: true,
      },
      select: {
        ...this.authSelect,
        role: {
          id: true,
        },
      },
    });
  }

  /**
   * Find user by id including password.
   */
  async findByIdWithPassword(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      select: this.authSelect,
    });
  }

  /**
   * Update user password.
   */
  async updatePassword(id: string, password: string): Promise<void> {
    await this.update(
      { id },
      {
        password,
      },
    );
  }

  /**
   * Find user by email.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findOneBy({ email });
  }

  /**
   * Update last login timestamp.
   */
  async updateLastLogin(id: string): Promise<void> {
    await this.update(
      { id },
      {
        lastLoginAt: new Date(),
      },
    );
  }

  /**
   * Mark user as verified.
   */
  async markAsVerified(id: string): Promise<void> {
    await this.update(
      { id },
      {
        isVerified: true,
      },
    );
  }
}
