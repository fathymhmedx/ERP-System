import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';

import { PermissionsService } from './permissions.service';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';

@Controller({
  path: 'permissions',
  version: '1',
})
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

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
}
