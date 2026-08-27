import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Employee } from './entities/employee.entity';

import { DepartmentsModule } from '../departments/departments.module';
import { PositionsModule } from '../positions/positions.module';
import { UsersModule } from 'src/modules/users/users.module';

import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeesRepository } from './employees.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee]),
    DepartmentsModule,
    PositionsModule,
    UsersModule,
  ],

  controllers: [EmployeesController],

  providers: [EmployeesService, EmployeesRepository],

  exports: [EmployeesRepository],
})
export class EmployeesModule {}
