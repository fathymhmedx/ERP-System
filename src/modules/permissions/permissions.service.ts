import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

import { GetPermissionsQueryDto, PermissionResponseDto } from './dto';
import { PermissionsRepository } from './permissions.repository';
import { PermissionMapper } from './mappers/permission.mapper';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async findAll(
    query: GetPermissionsQueryDto,
  ): Promise<PermissionResponseDto[]> {
    const options: FindManyOptions<Permission> = {
      order: {
        module: 'ASC',
        name: 'ASC',
      },
    };

    if (query.module) {
      options.where = {
        module: query.module,
      };
    }

    const permissions = await this.permissionsRepository.find(options);

    return permissions.map((permission) =>
      PermissionMapper.toResponseDto(permission),
    );
  }

  async findOne(id: string): Promise<PermissionResponseDto> {
    const permission = await this.permissionsRepository.findById(id);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return PermissionMapper.toResponseDto(permission);
  }
}
