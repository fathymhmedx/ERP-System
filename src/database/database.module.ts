import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseConfig } from 'src/config/database.config';

import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { RolePermission } from 'src/modules/role-permissions/entities/role-permission.entity';

import { SuperAdminSeeder } from './seeders/super-admin.seeder';
import { PermissionsSeeder } from './seeders/permissions.seeder';
import { RolePermissionsSeeder } from './seeders/role-permissions.seeder';

@Module({
  imports: [
    ConfigModule,

    TypeOrmModule.forRootAsync(databaseConfig),

    TypeOrmModule.forFeature([User, Role, Permission, RolePermission]),
  ],

  providers: [SuperAdminSeeder, PermissionsSeeder, RolePermissionsSeeder],
})
export class DatabaseModule {}
