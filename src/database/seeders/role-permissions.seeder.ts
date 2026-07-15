import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { RolePermission } from 'src/modules/role-permissions/entities/role-permission.entity';
import { Role } from 'src/modules/roles/entities/role.entity';

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

  async run(): Promise<void> {
    await this.assignAllPermissionsToSuperAdmin();

    console.log('Role permissions seeded successfully');
  }

  private async assignAllPermissionsToSuperAdmin() {
    const role = await this.roleRepository.findOne({
      where: {
        name: 'super_admin',
      },
    });

    if (!role) {
      throw new NotFoundException('Super admin role not found');
    }

    const permissions = await this.permissionRepository.find();

    for (const permission of permissions) {
      const exists = await this.rolePermissionRepository.findOne({
        where: {
          role: {
            id: role.id,
          },
          permission: {
            id: permission.id,
          },
        },
      });

      if (!exists) {
        await this.rolePermissionRepository.save({
          role,
          permission,
        });
      }
    }
  }
}
