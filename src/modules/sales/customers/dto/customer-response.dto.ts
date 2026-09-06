export class CustomerResponseDto {
  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string | null;
  phone!: string;
  address!: string | null;
  createdAt!: Date;
  updatedAt!: Date;
}
