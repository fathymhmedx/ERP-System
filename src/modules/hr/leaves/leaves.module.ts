import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Leave } from './entities/leave.entity';
import { LeavesController } from './leaves.controller';
import { LeavesService } from './leaves.service';
import { LeavesRepository } from './leaves.repository';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [TypeOrmModule.forFeature([Leave]), EmployeesModule],
  controllers: [LeavesController],
  providers: [LeavesService, LeavesRepository],
  exports: [LeavesRepository],
})
export class LeavesModule {}
