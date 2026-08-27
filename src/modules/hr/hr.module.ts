import { Module } from '@nestjs/common';

import { DepartmentsModule } from './departments/departments.module';
import { PositionsModule } from './positions/positions.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [DepartmentsModule, PositionsModule, EmployeesModule],
})
export class HrModule {}
