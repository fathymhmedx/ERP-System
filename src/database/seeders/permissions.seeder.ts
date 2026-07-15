import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Permission } from 'src/modules/permissions/entities/permission.entity';

@Injectable()
export class PermissionsSeeder {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async run() {
    const permissions = [
      // Users
      {
        name: 'users.create',
        module: 'users',
        description: 'Create users',
      },
      {
        name: 'users.read',
        module: 'users',
        description: 'View users',
      },
      {
        name: 'users.update',
        module: 'users',
        description: 'Update users',
      },
      {
        name: 'users.delete',
        module: 'users',
        description: 'Delete users',
      },

      // Roles
      {
        name: 'roles.create',
        module: 'roles',
        description: 'Create roles',
      },
      {
        name: 'roles.read',
        module: 'roles',
        description: 'View roles',
      },
      {
        name: 'roles.update',
        module: 'roles',
        description: 'Update roles',
      },
      {
        name: 'roles.delete',
        module: 'roles',
        description: 'Delete roles',
      },

      // Permissions
      {
        name: 'permissions.create',
        module: 'permissions',
        description: 'Create permissions',
      },
      {
        name: 'permissions.read',
        module: 'permissions',
        description: 'View permissions',
      },
      {
        name: 'permissions.update',
        module: 'permissions',
        description: 'Update permissions',
      },
      {
        name: 'permissions.delete',
        module: 'permissions',
        description: 'Delete permissions',
      },
    ];

    for (const permission of permissions) {
      const exists = await this.permissionRepository.findOne({
        where: {
          name: permission.name,
        },
      });

      if (!exists) {
        await this.permissionRepository.save(permission);
      }
    }

    console.log('Permissions seeded successfully');
  }
}
