import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Permission } from 'src/modules/permissions/entities/permission.entity';

@Injectable()
export class PermissionsSeeder {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async run(): Promise<void> {
    const modules = [
      'users',
      'roles',
      'permissions',
      'departments',
      'employees',
      'attendance',
      'leave_requests',
      'payroll',
      'companies',
    ];

    const actions = ['create', 'read', 'update', 'delete'];

    const permissions = modules.flatMap((module) =>
      actions.map((action) => ({
        name: `${module}.${action}`,
        module,
        description: `${action} ${module}`,
      })),
    );

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
