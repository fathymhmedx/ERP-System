import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerMapper } from './mappers/customer.mapper';
import { CustomersRepository } from './customers.repository';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async create(createCustomerDto: CreateCustomerDto) {
    const { email } = createCustomerDto;
    if (email) {
      const existingCustomer =
        await this.customersRepository.findByEmail(email);

      if (existingCustomer) {
        throw new ConflictException(
          'A customer with this email already exists',
        );
      }
    }

    const customer = this.customersRepository.create({
      ...createCustomerDto,
    });

    const savedCustomer = await this.customersRepository.save(customer);

    return CustomerMapper.toResponseDto(savedCustomer);
  }

  async findAll(query: CustomerQueryDto) {
    const { page, limit, search, phone } = query;

    const [customers, total] = await this.customersRepository.findPaginated(
      page,
      limit,
      search,
      phone,
    );

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: CustomerMapper.toResponseDtoList(customers),
    };
  }

  async findOne(id: string) {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return CustomerMapper.toResponseDto(customer);
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    if (
      updateCustomerDto.email &&
      updateCustomerDto.email.toLowerCase() !== customer.email?.toLowerCase()
    ) {
      const existingCustomer = await this.customersRepository.findByEmail(
        updateCustomerDto.email,
      );

      if (existingCustomer && existingCustomer.id !== id) {
        throw new ConflictException(
          'A customer with this email already exists',
        );
      }
    }

    this.customersRepository.merge(customer, updateCustomerDto);

    const updatedCustomer = await this.customersRepository.save(customer);

    return CustomerMapper.toResponseDto(updatedCustomer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.customersRepository.findById(id);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await this.customersRepository.softDelete({ id });
  }
}
