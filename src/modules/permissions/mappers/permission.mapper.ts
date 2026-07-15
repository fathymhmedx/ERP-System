import { PermissionResponseDto } from '../dto';
import { Permission } from '../entities/permission.entity';

export class PermissionMapper {
  static toResponseDto(permission: Permission): PermissionResponseDto {
    return {
      id: permission.id,
      name: permission.name,
      module: permission.module,
      description: permission.description,
      createdAt: permission.createdAt,
      updatedAt: permission.updatedAt,
    };
  }
}
