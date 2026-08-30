import { Module } from '@nestjs/common';

import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';
import { EmployeesModule } from './employees/employees.module';
import { AttendanceModule } from './attendance/attendance.module';
import { LeavesModule } from './leaves/leaves.module';
import { PayrollModule } from './payroll/payroll.module';

@Module({
  imports: [
    DepartmentsModule,
    PositionsModule,
    EmployeesModule,
    AttendanceModule,
    LeavesModule,
    PayrollModule,
  ],
})
export class HrModule {}
