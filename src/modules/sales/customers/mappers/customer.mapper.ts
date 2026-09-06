import { Customer } from '../entities/customer.entity';
import { CustomerResponseDto } from '../dto/customer-response.dto';

export class CustomerMapper {
  static toResponseDto(customer: Customer): CustomerResponseDto {
    return {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      createdAt: customer.createdAt,
      updatedAt: customer.updatedAt,
    };
  }

  static toResponseDtoList(customers: Customer[]): CustomerResponseDto[] {
    return customers.map((customer) => this.toResponseDto(customer));
  }
}
