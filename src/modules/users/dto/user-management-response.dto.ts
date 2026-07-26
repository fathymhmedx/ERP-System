export class UserManagementResponseDto {
  id!: string;
  email!: string;
  role!: {
    id: string;
    name: string;
  };
  isVerified!: boolean;
  isActive!: boolean;
  lastLoginAt!: Date | null;
  createdAt!: Date;
}
