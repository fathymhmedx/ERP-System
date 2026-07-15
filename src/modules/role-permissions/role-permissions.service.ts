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

@Injectable()
export class RolePermissionsService {
  constructor(
    private readonly rolePermissionsRepository: RolePermissionsRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly permissionsRepository: PermissionsRepository,
  ) {}

  async assignPermission(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermissionResponseDto> {
    await this.rolesRepository.findById(roleId);

    await this.permissionsRepository.findById(permissionId);

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
    if (!permission) throw new NotFoundException('permission not found');

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
  }
}
