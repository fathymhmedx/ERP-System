import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RolePermissionsRepository } from './role-permissions.repository';
import { RolesRepository } from '../roles/roles.repository';
import { PermissionsRepository } from '../permissions/permissions.repository';
import { RolePermissionMapper } from './mapper/RolePermission.mapper';
import { RolePermissionResponseDto } from './dto';
import { RbacCacheService } from 'src/common/cache/rbac-cache.service';

@Injectable()
export class RolePermissionsService {
  constructor(
    private readonly rolePermissionsRepository: RolePermissionsRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly permissionsRepository: PermissionsRepository,
    private readonly rbacCacheService: RbacCacheService,
  ) {}

  async assignPermission(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermissionResponseDto> {
    const role = await this.rolesRepository.findById(roleId);
    if (!role) throw new NotFoundException('Role not found');

    const permission = await this.permissionsRepository.findById(permissionId);
    if (!permission) throw new NotFoundException('Permission not found');

    const exists = await this.rolePermissionsRepository.exists({
      role: { id: roleId },
      permission: { id: permissionId },
    });

    if (exists) {
      throw new ConflictException('Permission already assigned to this role');
    }
    const rolePermission = this.rolePermissionsRepository.create({
      role: {
        id: roleId,
      },
      permission: {
        id: permissionId,
      },
    });

    const savedRolePermission =
      await this.rolePermissionsRepository.save(rolePermission);

    // Invalidate permission cache safely
    await this.rbacCacheService.invalidateRolePermissionsSafely(roleId);

    const result = await this.rolePermissionsRepository.findById(
      savedRolePermission.id,
      {
        relations: {
          role: true,
          permission: true,
        },
      },
    );

    return RolePermissionMapper.toResponseDto(result!);
  }
  async revokePermission(roleId: string, permissionId: string): Promise<void> {
    const role = await this.rolesRepository.findById(roleId);
    if (!role) throw new NotFoundException('Role not found');

    const permission = await this.permissionsRepository.findById(permissionId);
    if (!permission) throw new NotFoundException('Permission not found');

    const exists = await this.rolePermissionsRepository.exists({
      role: {
        id: roleId,
      },
      permission: {
        id: permissionId,
      },
    });

    if (!exists) {
      throw new NotFoundException('Permission is not assigned to this role');
    }

    await this.rolePermissionsRepository.delete({
      role: {
        id: roleId,
      },
      permission: {
        id: permissionId,
      },
    });

    // Invalidate permission cache safely
    await this.rbacCacheService.invalidateRolePermissionsSafely(roleId);
  }
}
