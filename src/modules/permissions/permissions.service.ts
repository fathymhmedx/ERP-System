import { Injectable, NotFoundException } from '@nestjs/common';

import { PermissionResponseDto } from './dto';
import { PermissionsRepository } from './permissions.repository';
import { PermissionMapper } from './mappers/permission.mapper';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async findAll(): Promise<PermissionResponseDto[]> {
    const permissions = await this.permissionsRepository.find();

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
