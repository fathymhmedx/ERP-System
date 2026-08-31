import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/constants/redis.constants';
import { randomUUID } from 'crypto';
export interface CachedRole {
  id: string;
  name: string;
}

@Injectable()
export class RbacCacheService {
  private readonly ROLE_PREFIX = 'rbac:role';
  private readonly LOCK_PREFIX = 'rbac:lock';
  private readonly LOCK_TTL_SECONDS = 5;

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  // Cache Keys
  private getRoleKey(roleId: string): string {
    return `${this.ROLE_PREFIX}:${roleId}`;
  }

  private getRolePermissionsKey(roleId: string): string {
    return `${this.ROLE_PREFIX}:${roleId}:permissions`;
  }

  // Lock Keys
  private getRoleLockKey(roleId: string): string {
    return `${this.LOCK_PREFIX}:role:${roleId}`;
  }

  private getRolePermissionsLockKey(roleId: string): string {
    return `${this.LOCK_PREFIX}:role-permissions:${roleId}`;
  }

  // Role Cache
  async getRole(roleId: string): Promise<CachedRole | null> {
    const key = this.getRoleKey(roleId);

    const cachedRole = await this.redis.get(key);

    if (cachedRole === null) {
      return null;
    }

    return JSON.parse(cachedRole) as CachedRole;
  }

  async setRole(role: CachedRole): Promise<void> {
    const key = this.getRoleKey(role.id);

    await this.redis.set(key, JSON.stringify(role));
  }

  private async invalidateRole(roleId: string): Promise<void> {
    await this.redis.del(this.getRoleKey(roleId));
  }

  async invalidateRoleSafely(roleId: string): Promise<void> {
    const maxAttempts = 50;
    const delay = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const lockValue = randomUUID();

      const acquired = await this.acquireRoleLock(roleId, lockValue);

      if (acquired) {
        try {
          await this.invalidateRole(roleId);
          return;
        } finally {
          await this.releaseRoleLock(roleId, lockValue);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    throw new Error('Unable to acquire role lock for cache invalidation');
  }

  // Permissions Cache
  async getRolePermissions(roleId: string): Promise<string[] | null> {
    const key = this.getRolePermissionsKey(roleId);

    const cachedPermissions = await this.redis.get(key);

    if (cachedPermissions === null) {
      return null;
    }

    return JSON.parse(cachedPermissions) as string[];
  }

  async setRolePermissions(
    roleId: string,
    permissions: string[],
  ): Promise<void> {
    const key = this.getRolePermissionsKey(roleId);

    await this.redis.set(key, JSON.stringify(permissions));
  }

  private async invalidateRolePermissions(roleId: string): Promise<void> {
    await this.redis.del(this.getRolePermissionsKey(roleId));
  }

  async invalidateRolePermissionsSafely(roleId: string): Promise<void> {
    const maxAttempts = 50;
    const delay = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const lockValue = randomUUID();

      const acquired = await this.acquireRolePermissionsLock(roleId, lockValue);

      if (acquired) {
        try {
          await this.invalidateRolePermissions(roleId);
          return;
        } finally {
          await this.releaseRolePermissionsLock(roleId, lockValue);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    throw new Error(
      'Unable to acquire role permissions lock for cache invalidation',
    );
  }

  // Invalidate Everything(Role, Permissions)
  private async invalidateRoleRbac(roleId: string): Promise<void> {
    await this.redis.del(
      this.getRoleKey(roleId),
      this.getRolePermissionsKey(roleId),
    );
  }
  async invalidateRoleRbacSafely(roleId: string): Promise<void> {
    const maxAttempts = 50;
    const delay = 100;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const roleLockValue = randomUUID();
      const permissionsLockValue = randomUUID();

      const roleLockAcquired = await this.acquireRoleLock(
        roleId,
        roleLockValue,
      );

      if (!roleLockAcquired) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      const permissionsLockAcquired = await this.acquireRolePermissionsLock(
        roleId,
        permissionsLockValue,
      );

      if (!permissionsLockAcquired) {
        await this.releaseRoleLock(roleId, roleLockValue);

        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      try {
        await this.invalidateRoleRbac(roleId);
        return;
      } finally {
        await this.releaseRolePermissionsLock(roleId, permissionsLockValue);

        await this.releaseRoleLock(roleId, roleLockValue);
      }
    }

    throw new Error('Unable to acquire RBAC locks for cache invalidation');
  }

  // Role Lock
  async acquireRoleLock(roleId: string, lockValue: string): Promise<boolean> {
    const key = this.getRoleLockKey(roleId);

    const result = await this.redis.set(
      key,
      lockValue,
      'EX',
      this.LOCK_TTL_SECONDS,
      'NX',
    );

    return result === 'OK';
  }

  async releaseRoleLock(roleId: string, lockValue: string): Promise<boolean> {
    const key = this.getRoleLockKey(roleId);

    const result = await this.redis.eval(
      `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      end

      return 0
      `,
      1,
      key,
      lockValue,
    );

    return result === 1;
  }

  // Role Permissions Lock
  async acquireRolePermissionsLock(
    roleId: string,
    lockValue: string,
  ): Promise<boolean> {
    const key = this.getRolePermissionsLockKey(roleId);

    const result = await this.redis.set(
      key,
      lockValue,
      'EX',
      this.LOCK_TTL_SECONDS,
      'NX',
    );

    return result === 'OK';
  }

  async releaseRolePermissionsLock(
    roleId: string,
    lockValue: string,
  ): Promise<boolean> {
    const key = this.getRolePermissionsLockKey(roleId);

    const result = await this.redis.eval(
      `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      end

      return 0
      `,
      1,
      key,
      lockValue,
    );

    return result === 1;
  }
}
