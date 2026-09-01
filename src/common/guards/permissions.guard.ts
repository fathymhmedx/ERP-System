import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { randomUUID } from 'crypto';

import { RolePermissionsRepository } from 'src/modules/role-permissions/role-permissions.repository';
import { RolesRepository } from 'src/modules/roles/roles.repository';

import { SYSTEM_ROLES } from '../constants/system-roles.constants';
import {
  IS_PUBLIC_KEY,
  PERMISSIONS_KEY,
} from '../constants/metadata.constants';
import { AuthRequest } from '../interfaces/auth/auth-request.interface';

import { RbacCacheService } from '../cache/rbac-cache.service';
import { CachedRole } from '../cache/interfaces/cached-role.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rolePermissionsRepository: RolePermissionsRepository,
    private readonly rolesRepository: RolesRepository,
    private readonly rbacCacheService: RbacCacheService,
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

    if (!requiredPermissions?.length) {
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

    // Role Cache
    let role = await this.rbacCacheService.getRole(roleId);

    if (role === null) {
      const lockValue = randomUUID();

      const acquired = await this.rbacCacheService.acquireRoleLock(
        roleId,
        lockValue,
      );

      if (acquired) {
        try {
          // Double-check after acquiring the lock
          role = await this.rbacCacheService.getRole(roleId);

          if (role === null) {
            const databaseRole = await this.rolesRepository.findById(roleId);

            if (!databaseRole) {
              throw new ForbiddenException('Role not found');
            }

            role = {
              id: databaseRole.id,
              name: databaseRole.name,
            };

            await this.rbacCacheService.setRole(role);
          }
        } finally {
          await this.rbacCacheService.releaseRoleLock(roleId, lockValue);
        }
      } else {
        // Another request is loading the role cache
        role = await this.waitForRoleCache(roleId);

        if (role === null) {
          throw new ForbiddenException('Unable to load role');
        }
      }
    }

    // Super Admin Bypass
    if (role.name === SYSTEM_ROLES.SUPER_ADMIN) {
      return true;
    }

    // Permission Cache
    let permissions = await this.rbacCacheService.getRolePermissions(roleId);

    if (permissions === null) {
      const lockValue = randomUUID();

      const acquired = await this.rbacCacheService.acquireRolePermissionsLock(
        roleId,
        lockValue,
      );

      if (acquired) {
        try {
          // Double-check after acquiring the lock
          permissions = await this.rbacCacheService.getRolePermissions(roleId);

          if (permissions === null) {
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

            permissions = rolePermissions.map(
              (rolePermission) => rolePermission.permission.name,
            );

            await this.rbacCacheService.setRolePermissions(roleId, permissions);
          }
        } finally {
          await this.rbacCacheService.releaseRolePermissionsLock(
            roleId,
            lockValue,
          );
        }
      } else {
        // Another request is loading the cache
        permissions = await this.waitForPermissionsCache(roleId);

        if (permissions === null) {
          throw new ForbiddenException('Unable to load role permissions');
        }
      }
    }

    // Permission Check
    const permissionSet = new Set(permissions);

    const hasPermission = requiredPermissions.every((permission) =>
      permissionSet.has(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException('You do not have permission');
    }

    return true;
  }

  // for Cache Stampede Protection
  private async waitForRoleCache(roleId: string): Promise<CachedRole | null> {
    const maxAttempts = 50;
    const delay = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const role = await this.rbacCacheService.getRole(roleId);

      if (role !== null) {
        return role;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    return null;
  }

  // for Cache Stampede Protection
  private async waitForPermissionsCache(
    roleId: string,
  ): Promise<string[] | null> {
    const maxAttempts = 50;
    const delay = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const permissions =
        await this.rbacCacheService.getRolePermissions(roleId);

      if (permissions !== null) {
        return permissions;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    return null;
  }
}
