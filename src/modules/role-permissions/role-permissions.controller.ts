import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';

import { RolePermissionsService } from './role-permissions.service';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
@Controller({
  path: 'roles',
  version: '1',
})
export class RolePermissionsController {
  constructor(
    private readonly rolePermissionsService: RolePermissionsService,
  ) {}

  @Post(':roleId/permissions')
  @SuccessMessage('Permission assigned successfully')
  assignPermission(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    return this.rolePermissionsService.assignPermission(
      roleId,
      assignPermissionDto.permissionId,
    );
  }

  @Delete(':roleId/permissions/:permissionId')
  @SuccessMessage('Permission revoked successfully')
  revokePermission(
    @Param('roleId', ParseUUIDPipe) roleId: string,
    @Param('permissionId', ParseUUIDPipe) permissionId: string,
  ) {
    return this.rolePermissionsService.revokePermission(roleId, permissionId);
  }
}
