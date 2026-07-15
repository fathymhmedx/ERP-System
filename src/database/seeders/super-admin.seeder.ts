import * as bcrypt from 'bcrypt';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { ConfigService } from '@nestjs/config';
import { ENV } from 'src/config/env.constants';

@Injectable()
export class SuperAdminSeeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly configService: ConfigService,
  ) {
    console.log(configService);
  }

  async run(): Promise<void> {
    const email = this.configService.getOrThrow<string>(ENV.SUPER_ADMIN_EMAIL);
    const password = this.configService.getOrThrow<string>(
      ENV.SUPER_ADMIN_PASSWORD,
    );
    const fullName = this.configService.getOrThrow<string>(
      ENV.SUPER_ADMIN_FULL_NAME,
    );
    console.log(this.configService.get('SUPER_ADMIN_EMAIL'));
    console.log(this.configService.get('SUPER_ADMIN_PASSWORD'));
    console.log(this.configService.get('SUPER_ADMIN_FULL_NAME'));
    const exists = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (exists) {
      console.log('Super admin already exists');
      return;
    }

    const role = await this.roleRepository.findOne({
      where: {
        name: 'super_admin',
      },
    });

    if (!role) {
      throw new NotFoundException('Super admin role not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepository.save({
      fullName,
      email,
      password: hashedPassword,
      isActive: true,
      isVerified: true,
      role,
    });

    console.log('Super admin created successfully');
  }
}
