import * as bcrypt from 'bcrypt';
import { BaseEntity } from 'src/common/entities/base.entity';
import { RefreshToken } from 'src/modules/auth/refresh-tokens/entities/refresh-token.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password!: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isVerified!: boolean;

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive!: boolean;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  lastLoginAt!: Date | null;

  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
  })
  @JoinColumn({
    name: 'role_id',
  })
  role!: Role;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens!: RefreshToken[];

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
