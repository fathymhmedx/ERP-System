import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';

import { UserMapper } from './mappers/user.mapper';
import { UserResponseDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: UsersRepository,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserMapper.toResponseDto(user);
  }
}
