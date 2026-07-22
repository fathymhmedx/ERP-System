import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { PermissionsService } from './permissions.service';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { GetPermissionsQueryDto } from './dto/get-permissions-query.dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';

@Controller({
  path: 'permissions',
  version: '1',
})
@Permissions(PERMISSIONS.PERMISSIONS.READ)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @SuccessMessage('Permissions retrieved successfully')
  findAll(@Query() query: GetPermissionsQueryDto) {
    return this.permissionsService.findAll(query);
  }

  @Get(':id')
  @SuccessMessage('Permission retrieved successfully')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string,
  ) {
    return this.permissionsService.findOne(id);
  }
}
