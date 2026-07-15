import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RolePermission } from './entities/role-permission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';

@Injectable()
export class RolePermissionsRepository extends BaseRepository<RolePermission> {
  constructor(
    @InjectRepository(RolePermission)
    repository: Repository<RolePermission>,
  ) {
    super(repository);
  }
}
