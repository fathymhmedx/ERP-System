import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsRepository } from './permissions.repository';
import { PermissionsController } from './permissions.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository],
  exports: [PermissionsRepository],
})
export class PermissionsModule {}
