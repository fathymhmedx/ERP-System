import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';

@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @Permissions(PERMISSIONS.ROLES.CREATE)
  @SuccessMessage('Role created successfully')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @Permissions(PERMISSIONS.ROLES.READ)
  @SuccessMessage('Roles retrieved successfully')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @Permissions(PERMISSIONS.ROLES.READ)
  @SuccessMessage('Role retrieved successfully')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.ROLES.UPDATE)
  @SuccessMessage('Role updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.ROLES.DELETE)
  @SuccessMessage('Role deleted successfully')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
