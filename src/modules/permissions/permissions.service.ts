import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import {
  CreatePermissionDto,
  PermissionResponseDto,
  UpdatePermissionDto,
} from './dto';
import { PermissionsRepository } from './permissions.repository';
import { PermissionMapper } from './mappers/permission.mapper';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async create(
    createPermissionDto: CreatePermissionDto,
  ): Promise<PermissionResponseDto> {
    const { name } = createPermissionDto;

    const exists = await this.permissionsRepository.exists({
      name,
    });

    if (exists) {
      throw new ConflictException('Permission already exists');
    }

    const permission = this.permissionsRepository.create(createPermissionDto);

    const savedPermission = await this.permissionsRepository.save(permission);

    return PermissionMapper.toResponseDto(savedPermission);
  }

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

  async update(
    id: string,
    updatePermissionDto: UpdatePermissionDto,
  ): Promise<PermissionResponseDto> {
    await this.findOne(id);

    await this.permissionsRepository.update({ id }, updatePermissionDto);

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.permissionsRepository.delete({
      id,
    });
  }
}
