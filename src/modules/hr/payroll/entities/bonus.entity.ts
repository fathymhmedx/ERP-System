import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('bonuses')
export class Bonus extends BaseEntity {
  @ManyToOne(() => Employee, (employee) => employee.bonuses, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'employee_id',
  })
  employee!: Employee;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  amount!: string;

  @Column({
    type: 'varchar',
    length: 500,
  })
  reason!: string;

  @Column({
    type: 'date',
  })
  date!: Date;
}
