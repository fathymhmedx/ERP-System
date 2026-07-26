import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

import { RefreshTokensService } from '../auth/refresh-tokens/refresh-tokens.service';
import { UserMapper } from './mappers/user.mapper';
import {
  ResetPasswordDto,
  UserManagementResponseDto,
  UserResponseDto,
  GetUsersQueryDto,
} from './dto';
import { AUTH_CONSTANTS } from '../auth/constants/auth.constants';
import { PaginatedResponse } from 'src/common/interfaces/pagination/paginated-response.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly refreshTokensService: RefreshTokensService,
  ) {}

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.toResponseDto(user);
  }

  async getUsers(
    query: GetUsersQueryDto,
  ): Promise<PaginatedResponse<UserManagementResponseDto>> {
    const [users, total] = await this.usersRepository.findAllWithRole(query);

    return {
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      data: users.map((user) => UserMapper.toManagementResponseDto(user)),
    };
  }

  async getUser(id: string): Promise<UserManagementResponseDto> {
    const user = await this.findUserWithRoleOrFail(id);

    return UserMapper.toManagementResponseDto(user);
  }

  async activateUser(id: string): Promise<void> {
    const user = await this.findUserOrFail(id);

    if (user.isActive) {
      throw new BadRequestException('User is already active');
    }

    await this.usersRepository.update(
      { id },
      {
        isActive: true,
      },
    );
  }

  async deactivateUser(id: string): Promise<void> {
    const user = await this.findUserOrFail(id);

    if (!user.isActive) {
      throw new BadRequestException('User is already inactive');
    }

    await this.usersRepository.update(
      { id },
      {
        isActive: false,
      },
    );

    await this.refreshTokensService.revokeAllByUser(id);
  }

  async resetPassword(
    id: string,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    const userExists = await this.usersRepository.exists({ id });

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const { newPassword } = resetPasswordDto;
    const hashedPassword = await bcrypt.hash(
      newPassword,
      AUTH_CONSTANTS.BCRYPT_SALT_ROUNDS,
    );

    await this.usersRepository.updatePassword(id, hashedPassword);

    await this.refreshTokensService.revokeAllByUser(id);
  }

  private async findUserWithRoleOrFail(id: string): Promise<User> {
    const user = await this.usersRepository.findByIdWithRole(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async findUserOrFail(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
