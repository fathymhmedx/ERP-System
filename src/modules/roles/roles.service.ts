import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RolesRepository } from './roles.repository';
import { CreateRoleDto, UpdateRoleDto, RoleResponseDto } from './dto';
import { RoleMapper } from './mappers/role.mapper';
import { SYSTEM_ROLES } from 'src/common/constants/system-roles.constants';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async create(createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    const { name } = createRoleDto;
    const exists = await this.rolesRepository.exists({
      name,
    });

    if (exists) {
      throw new ConflictException('Role already exists');
    }

    if (name === SYSTEM_ROLES.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot create super_admin role');
    }

    const role = this.rolesRepository.create(createRoleDto);

    const savedRole = await this.rolesRepository.save(role);
    return RoleMapper.toResponseDto(savedRole);
  }

  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.rolesRepository.find();
    return roles.map((role) => RoleMapper.toResponseDto(role));
  }

  async findOne(id: string): Promise<RoleResponseDto> {
    const role = await this.rolesRepository.findById(id);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return RoleMapper.toResponseDto(role);
  }

  async update(
    id: string,
    updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    await this.findOne(id);

    await this.rolesRepository.update({ id }, updateRoleDto);

    const updatedRole = this.findOne(id);
    return updatedRole;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);

    await this.rolesRepository.delete({
      id,
    });
  }
}
