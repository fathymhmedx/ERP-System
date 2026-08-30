import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { LeavesService } from './leaves.service';
import {
  CreateLeaveDto,
  LeaveQueryDto,
  LeaveResponseDto,
  RejectLeaveDto,
} from './dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/interfaces/auth/auth-user.interface';
import { PaginatedResponse } from 'src/common/interfaces/pagination/paginated-response.interface';
@Controller({
  path: 'leaves',
  version: '1',
})
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  @Permissions(PERMISSIONS.LEAVES.REQUEST)
  @SuccessMessage('Leave request submitted successfully')
  requestLeave(
    @CurrentUser() user: AuthUser,
    @Body() createLeaveDto: CreateLeaveDto,
  ): Promise<LeaveResponseDto> {
    return this.leavesService.requestLeave(user.id, createLeaveDto);
  }

  @Get()
  @Permissions(PERMISSIONS.LEAVES.READ)
  findAll(
    @Query() query: LeaveQueryDto,
  ): Promise<PaginatedResponse<LeaveResponseDto>> {
    return this.leavesService.findAll(query);
  }

  @Patch(':id/approve')
  @Permissions(PERMISSIONS.LEAVES.APPROVE)
  @SuccessMessage('Leave request approved successfully')
  approveLeave(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LeaveResponseDto> {
    return this.leavesService.approveLeave(user.id, id);
  }

  @Patch(':id/reject')
  @Permissions(PERMISSIONS.LEAVES.REJECT)
  @SuccessMessage('Leave request rejected successfully')
  rejectLeave(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RejectLeaveDto,
  ): Promise<LeaveResponseDto> {
    return this.leavesService.rejectLeave(user.id, id, dto);
  }

  @Patch(':id/cancel')
  @Permissions(PERMISSIONS.LEAVES.CANCEL)
  @SuccessMessage('Leave request cancelled successfully')
  cancelLeave(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<LeaveResponseDto> {
    return this.leavesService.cancelLeave(user.id, id);
  }
}
