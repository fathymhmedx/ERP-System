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

@Controller({
  path: 'roles',
  version: '1',
})
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @SuccessMessage('Role created successfully')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @SuccessMessage('Roles retrieved successfully')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @SuccessMessage('Role retrieved successfully')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @SuccessMessage('Role updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @SuccessMessage('Role deleted successfully')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }
}
