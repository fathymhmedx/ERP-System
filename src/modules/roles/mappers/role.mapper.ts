import { RoleResponseDto } from '../dto';
import { RoleDetailsResponseDto } from '../dto/role-details-response.dto';
import { Role } from '../entities/role.entity';

export class RoleMapper {
  static toResponseDto(role: Role): RoleResponseDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }

  static toDetailsResponseDto(role: Role): RoleDetailsResponseDto {
    return {
      ...this.toResponseDto(role),

      permissions: role.rolePermissions
        .map(({ permission }) => ({
          id: permission.id,
          name: permission.name,
          module: permission.module,
          description: permission.description,
        }))
        .sort((first, second) => first.name.localeCompare(second.name)),
    };
  }
}
