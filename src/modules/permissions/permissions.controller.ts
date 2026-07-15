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

import { PermissionsService } from './permissions.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';

@Controller({
  path: 'permissions',
  version: '1',
})
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @SuccessMessage('Permission created successfully')
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @Get()
  @SuccessMessage('Permissions retrieved successfully')
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  @SuccessMessage('Permission retrieved successfully')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @SuccessMessage('Permission updated successfully')
  update(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Body()
    updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  @SuccessMessage('Permission deleted successfully')
  remove(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.permissionsService.remove(id);
  }
}
