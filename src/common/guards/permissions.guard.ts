import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { RolePermissionsRepository } from 'src/modules/role-permissions/role-permissions.repository';
import { SYSTEM_ROLES } from '../constants/system-roles.constants';
import { RolesRepository } from 'src/modules/roles/roles.repository';
import { AuthRequest } from '../interfaces/auth-request.interface';
import {
  IS_PUBLIC_KEY,
  PERMISSIONS_KEY,
} from '../constants/metadata.constants';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolePermissionsRepository: RolePermissionsRepository,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Route doesn't require permissions
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthRequest>();
    if (!request.user) {
      throw new ForbiddenException('Authentication required');
    }

    const { roleId } = request.user;

    if (!roleId) {
      throw new ForbiddenException('User role not found');
    }

    // Super admin bypass
    const role = await this.rolesRepository.findById(roleId);

    if (!role) {
      throw new ForbiddenException('Role not found');
    }

    if (role.name === SYSTEM_ROLES.SUPER_ADMIN) {
      return true;
    }

    const rolePermissions = await this.rolePermissionsRepository.find({
      where: {
        role: {
          id: roleId,
        },
      },
      relations: {
        permission: true,
      },
    });

    const permissions = new Set(
      rolePermissions.map((rolePermission) => rolePermission.permission.name),
    );

    const hasPermission = requiredPermissions.every((permission) =>
      permissions.has(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }
}
