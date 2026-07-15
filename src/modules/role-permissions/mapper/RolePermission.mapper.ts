import { RolePermissionResponseDto } from '../dto';
import { RolePermission } from '../entities/role-permission.entity';

export class RolePermissionMapper {
  static toResponseDto(
    rolePermission: RolePermission,
  ): RolePermissionResponseDto {
    return {
      roleId: rolePermission.role.id,
      roleName: rolePermission.role.name,

      permissionId: rolePermission.permission.id,
      permissionName: rolePermission.permission.name,
      module: rolePermission.permission.module,
    };
  }
}
