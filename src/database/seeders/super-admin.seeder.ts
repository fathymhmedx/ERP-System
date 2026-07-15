import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/role.entity';

@Injectable()
export class SuperAdminSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async run() {
    const roleName = 'super_admin';

    let role = await this.roleRepository.findOne({
      where: {
        name: roleName,
      },
    });

    if (!role) {
      role = this.roleRepository.create({
        name: roleName,
        description: 'Full system access',
      });

      await this.roleRepository.save(role);
    }

    const email = 'admin@example.com';

    const existingUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      console.log('Super admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash('Admin@123456', 12);

    const user = this.userRepository.create({
      fullName: 'Super Admin',

      email,

      password: hashedPassword,

      isVerified: true,

      isActive: true,

      role,
    });

    await this.userRepository.save(user);

    console.log('Super admin created successfully');
  }
}
