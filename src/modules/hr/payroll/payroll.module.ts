import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Payroll } from './entities/payroll.entity';
import { Bonus } from './entities/bonus.entity';
import { Deduction } from './entities/deduction.entity';

import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';

import { PayrollRepository } from './repositories/payroll.repository';
import { BonusRepository } from './repositories/bonus.repository';
import { DeductionRepository } from './repositories/deduction.repository';

import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payroll, Bonus, Deduction]),
    EmployeesModule,
  ],
  controllers: [PayrollController],
  providers: [
    PayrollService,
    PayrollRepository,
    BonusRepository,
    DeductionRepository,
  ],
  exports: [PayrollRepository, BonusRepository, DeductionRepository],
})
export class PayrollModule {}
