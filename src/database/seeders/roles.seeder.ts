import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from 'src/modules/roles/entities/role.entity';

@Injectable()
export class RolesSeeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async run(): Promise<void> {
    const roles = [
      {
        name: 'super_admin',
        description: 'Full system access',
      },
      {
        name: 'admin',
        description: 'Company administrator',
      },
      {
        name: 'manager',
        description: 'Department manager',
      },
      {
        name: 'employee',
        description: 'Regular employee',
      },
    ];

    for (const role of roles) {
      const exists = await this.roleRepository.findOne({
        where: {
          name: role.name,
        },
      });

      if (!exists) {
        await this.roleRepository.save(role);
      }
    }

    console.log('Roles seeded successfully');
  }
}
