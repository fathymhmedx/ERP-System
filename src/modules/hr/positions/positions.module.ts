import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Position } from './entities/position.entity';

import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { PositionsRepository } from './positions.repository';

import { DepartmentsModule } from '../departments/departments.module';

@Module({
  imports: [TypeOrmModule.forFeature([Position]), DepartmentsModule],
  controllers: [PositionsController],
  providers: [PositionsService, PositionsRepository],
  exports: [PositionsRepository],
})
export class PositionsModule {}
