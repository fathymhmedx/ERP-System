import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { Position } from './entities/position.entity';

@Injectable()
export class PositionsRepository extends BaseRepository<Position> {
  constructor(
    @InjectRepository(Position)
    repository: Repository<Position>,
  ) {
    super(repository);
  }

  async findByTitleAndDepartment(
    title: string,
    departmentId: string,
  ): Promise<Position | null> {
    return this.findOne({
      where: {
        title,
        department: {
          id: departmentId,
        },
      },
      relations: {
        department: true,
      },
    });
  }

  async findAll(): Promise<Position[]> {
    return this.find({
      relations: {
        department: true,
      },
      order: {
        title: 'ASC',
      },
    });
  }

  async findByIdWithDepartment(id: string): Promise<Position | null> {
    return this.findById(id, {
      relations: {
        department: true,
      },
    });
  }
}
