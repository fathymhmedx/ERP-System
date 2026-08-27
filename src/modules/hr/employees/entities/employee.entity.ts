import { BaseEntity } from 'src/common/entities/base.entity';

import { Department } from '../../departments/entities/department.entity';
import { Position } from '../../positions/entities/position.entity';

import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { EmploymentStatus } from '../enums/employment-status.enum';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('employees')
export class Employee extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
  })
  employeeNumber!: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  firstName!: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  lastName!: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  phone!: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  address!: string | null;

  @Column({
    type: 'date',
    nullable: true,
  })
  dateOfBirth!: Date | null;

  @Column({
    type: 'date',
  })
  hireDate!: Date;

  @Column({
    type: 'enum',
    enum: EmploymentStatus,
    default: EmploymentStatus.ACTIVE,
  })
  @Index()
  employmentStatus!: EmploymentStatus;

  @OneToOne(() => User, (user) => user.employee, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User | null;

  @ManyToOne(() => Department, (department) => department.employees, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'department_id',
  })
  department!: Department | null;

  @ManyToOne(() => Position, (position) => position.employees, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'position_id',
  })
  position!: Position | null;

  @ManyToOne(() => Employee, (employee) => employee.subordinates, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'manager_id',
  })
  manager!: Employee | null;

  @OneToMany(() => Employee, (employee) => employee.manager)
  subordinates!: Employee[];
}
