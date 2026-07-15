import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { RolePermissionsRepository } from './role-permissions.repository';
import { RolePermissionsService } from './role-permissions.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import { RolePermissionsController } from './role-permissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermission]),
    RolesModule,
    PermissionsModule,
  ],
  controllers: [RolePermissionsController],
  providers: [RolePermissionsService, RolePermissionsRepository],
  exports: [RolePermissionsRepository],
})
export class RolePermissionsModule {}
