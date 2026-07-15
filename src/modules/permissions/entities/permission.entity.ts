import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { RolePermission } from 'src/modules/role-permissions/entities/role-permission.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  module!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string | null;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions!: RolePermission[];
}
