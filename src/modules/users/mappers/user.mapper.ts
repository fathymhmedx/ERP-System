import { User } from '../entities/user.entity';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserManagementResponseDto } from '../dto';

export class UserMapper {
  static toResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toManagementResponseDto(user: User): UserManagementResponseDto {
    return {
      id: user.id,
      email: user.email,
      role: {
        id: user.role.id,
        name: user.role.name,
      },
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
    };
  }
}
