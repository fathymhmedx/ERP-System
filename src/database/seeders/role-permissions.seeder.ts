import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from 'src/modules/roles/entities/role.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { RolePermission } from 'src/modules/role-permissions/entities/role-permission.entity';

@Injectable()
export class RolePermissionsSeeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,

    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async run() {
    const superAdminRole = await this.roleRepository.findOne({
      where: {
        name: 'super_admin',
      },
    });

    if (!superAdminRole) {
      throw new Error('Super admin role not found');
    }

    const permissions = await this.permissionRepository.find();

    for (const permission of permissions) {
      const exists = await this.rolePermissionRepository.findOne({
        where: {
          role: {
            id: superAdminRole.id,
          },
          permission: {
            id: permission.id,
          },
        },
      });

      if (!exists) {
        await this.rolePermissionRepository.save({
          role: superAdminRole,

          permission,
        });
      }
    }

    console.log('Super admin permissions assigned successfully');
  }
}
