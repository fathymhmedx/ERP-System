import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 64,
    unique: true,
    select: false,
  })
  tokenHash!: string;

  @Index()
  @Column({
    type: 'timestamptz',
  })
  expiresAt!: Date;

  @Index()
  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  revokedAt!: Date | null;

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;
}
