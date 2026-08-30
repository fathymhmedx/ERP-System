import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from 'src/config/database.config';

import { User } from 'src/modules/users/entities/user.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { RolePermission } from 'src/modules/role-permissions/entities/role-permission.entity';
import { RefreshToken } from 'src/modules/auth/refresh-tokens/entities/refresh-token.entity';
import { PermissionsSeeder } from './permissions.seeder';
import { SuperAdminSeeder } from './super-admin.seeder';
import { RolePermissionsSeeder } from './role-permissions.seeder';
import { RolesSeeder } from './roles.seeder';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development'],
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    TypeOrmModule.forFeature([
      User,
      Role,
      Permission,
      RolePermission,
      RefreshToken,
    ]),
  ],
  providers: [
    RolesSeeder,
    PermissionsSeeder,
    RolePermissionsSeeder,
    SuperAdminSeeder,
  ],
})
export class SeederModule {}
