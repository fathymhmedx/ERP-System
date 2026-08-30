import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';

import { AttendanceService } from './attendance.service';
import {
  AttendanceQueryDto,
  AttendanceResponseDto,
  MonthlyReportQueryDto,
  MonthlyReportResponseDto,
} from './dto';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { AuthUser } from 'src/common/interfaces/auth/auth-user.interface';
import { PaginatedResponse } from 'src/common/interfaces/pagination/paginated-response.interface';

@Controller({
  path: 'attendance',
  version: '1',
})
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in')
  @Permissions(PERMISSIONS.ATTENDANCE.CHECK_IN)
  @SuccessMessage('Checked in successfully')
  checkIn(@CurrentUser() user: AuthUser): Promise<AttendanceResponseDto> {
    return this.attendanceService.checkIn(user.id);
  }

  @Post('check-out')
  @Permissions(PERMISSIONS.ATTENDANCE.CHECK_OUT)
  @SuccessMessage('Checked out successfully')
  checkOut(@CurrentUser() user: AuthUser): Promise<AttendanceResponseDto> {
    return this.attendanceService.checkOut(user.id);
  }

  @Get()
  @Permissions(PERMISSIONS.ATTENDANCE.READ)
  findAll(
    @Query() query: AttendanceQueryDto,
  ): Promise<PaginatedResponse<AttendanceResponseDto>> {
    return this.attendanceService.findAll(query);
  }

  @Get('employee/:employeeId')
  @Permissions(PERMISSIONS.ATTENDANCE.READ)
  findByEmployee(
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @Query() query: AttendanceQueryDto,
  ): Promise<PaginatedResponse<AttendanceResponseDto>> {
    return this.attendanceService.findByEmployee(employeeId, query);
  }

  @Get('reports/monthly')
  @Permissions(PERMISSIONS.ATTENDANCE.READ)
  getMonthlyReport(
    @Query() query: MonthlyReportQueryDto,
  ): Promise<MonthlyReportResponseDto> {
    return this.attendanceService.getMonthlyReport(query);
  }
}
