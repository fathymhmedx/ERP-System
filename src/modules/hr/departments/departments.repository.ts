import { BaseRepository } from 'src/common/repositories/base.repository';
import { Department } from './entities/department.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentsRepository extends BaseRepository<Department> {
  constructor(
    @InjectRepository(Department)
    repository: Repository<Department>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Department | null> {
    return this.findOne({
      where: { name },
    });
  }

  async findAll(): Promise<Department[]> {
    return this.find({
      order: {
        name: 'ASC',
      },
    });
  }
}
