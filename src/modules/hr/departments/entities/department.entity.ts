import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { Position } from 'src/modules/hr/positions/entities/position.entity';
import { Employee } from 'src/modules/hr/employees/entities/employee.entity';

@Entity('departments')
export class Department extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description!: string | null;

  @OneToMany(() => Position, (position) => position.department)
  positions!: Position[];

  @OneToMany(() => Employee, (employee) => employee.department)
  employees!: Employee[];
}
