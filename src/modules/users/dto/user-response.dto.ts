export class UserResponseDto {
  id!: string;

  fullName!: string;

  email!: string;

  isVerified!: boolean;

  isActive!: boolean;

  lastLoginAt!: Date | null;

  createdAt!: Date;

  updatedAt!: Date;
}
