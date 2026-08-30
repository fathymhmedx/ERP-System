import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { AttendanceStatus } from '../enums/attendance-status.enum';

@Entity('attendances')
@Index(['employee', 'date'], { unique: true })
export class Attendance extends BaseEntity {
  @ManyToOne(() => Employee, (employee) => employee.attendances, {
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
  date!: Date;

  @Column({
    type: 'timestamptz',
  })
  checkIn!: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  checkOut!: Date | null;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status!: AttendanceStatus;
}
