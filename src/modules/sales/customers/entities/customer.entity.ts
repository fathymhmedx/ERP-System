import { Column, Entity } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  firstName!: string;

  @Column({ type: 'varchar', length: 100 })
  lastName!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email!: string | null;

  @Column({ type: 'varchar', length: 20 })
  phone!: string;

  @Column({ type: 'text', nullable: true })
  address!: string | null;
}
