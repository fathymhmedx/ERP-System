import { BaseEntity } from 'src/common/entities/base.entity';

import { Employee } from '../../employees/entities/employee.entity';
import { LeaveStatus } from '../enums/leave-status.enum';

import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

@Entity('leaves')
@Index(['employee', 'status'])
export class Leave extends BaseEntity {
  @ManyToOne(() => Employee, (employee) => employee.leaves, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'employee_id',
  })
  employee!: Employee;

  @Column({
    type: 'date',
  })
  startDate!: Date;

  @Column({
    type: 'date',
  })
  endDate!: Date;

  @Column({
    type: 'varchar',
    length: 500,
  })
  reason!: string;

  @Column({
    type: 'enum',
    enum: LeaveStatus,
    default: LeaveStatus.PENDING,
  })
  status!: LeaveStatus;

  @ManyToOne(() => Employee, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'approved_by_id',
  })
  approvedBy!: Employee | null;

  @ManyToOne(() => Employee, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'rejected_by_id',
  })
  rejectedBy!: Employee | null;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  rejectionReason!: string | null;
}
