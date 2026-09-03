import { Supplier } from '../entities/supplier.entity';
import { SupplierResponseDto } from '../dto/supplier-response.dto';

export class SupplierMapper {
  static toResponseDto(supplier: Supplier): SupplierResponseDto {
    return {
      id: supplier.id,
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      contactPerson: supplier.contactPerson,
      createdAt: supplier.createdAt,
      updatedAt: supplier.updatedAt,
    };
  }

  static toResponseDtoList(suppliers: Supplier[]): SupplierResponseDto[] {
    return suppliers.map((supplier) => this.toResponseDto(supplier));
  }
}
