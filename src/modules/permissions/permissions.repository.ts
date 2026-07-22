import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repositories/base.repository';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionsRepository extends BaseRepository<Permission> {
  constructor(
    @InjectRepository(Permission)
    repository: Repository<Permission>,
  ) {
    super(repository);
  }
}
