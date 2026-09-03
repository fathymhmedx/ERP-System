export class SupplierResponseDto {
  id!: string;

  name!: string;

  email!: string | null;

  phone!: string;

  address!: string | null;

  contactPerson!: string | null;

  createdAt!: Date;

  updatedAt!: Date;
}
