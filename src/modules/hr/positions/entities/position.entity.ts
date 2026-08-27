import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Department } from '../../departments/entities/department.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('positions')
@Index(['title', 'department'], { unique: true })
export class Position extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 100,
  })
  title!: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description!: string | null;

  @ManyToOne(() => Department, (department) => department.positions, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'department_id',
  })
  department!: Department;

  @OneToMany(() => Employee, (employee) => employee.position)
  employees!: Employee[];
}
