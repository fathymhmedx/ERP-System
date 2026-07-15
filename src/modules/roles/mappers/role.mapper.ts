import { RoleResponseDto } from '../dto';
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
}
