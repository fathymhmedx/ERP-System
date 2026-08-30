import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { PayrollStatus } from '../enums/payroll-status.enum';

@Entity('payrolls')
@Index(['employee', 'year', 'month'], { unique: true })
export class Payroll extends BaseEntity {
  @ManyToOne(() => Employee, (employee) => employee.payrolls, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'employee_id',
  })
  employee!: Employee;

  @Column({
    type: 'int',
  })
  year!: number;

  @Column({
    type: 'int',
  })
  month!: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  baseSalary!: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  totalBonus!: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    default: 0,
  })
  totalDeduction!: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  netSalary!: string;

  @Column({
    type: 'enum',
    enum: PayrollStatus,
    default: PayrollStatus.GENERATED,
  })
  status!: PayrollStatus;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  generatedAt!: Date;
}
