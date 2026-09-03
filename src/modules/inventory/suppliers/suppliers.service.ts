import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { SuppliersRepository } from './suppliers.repository';
import { CreateSupplierDto, SupplierQueryDto, UpdateSupplierDto } from './dto';
import { SupplierMapper } from './mappers/supplier.mapper';

@Injectable()
export class SuppliersService {
  constructor(private readonly suppliersRepository: SuppliersRepository) {}

  async create(createSupplierDto: CreateSupplierDto) {
    const { name } = createSupplierDto;

    const existingSupplier = await this.suppliersRepository.findByName(name);

    if (existingSupplier) {
      throw new ConflictException('Supplier with this name already exists');
    }

    const supplier = this.suppliersRepository.create(createSupplierDto);

    const savedSupplier = await this.suppliersRepository.save(supplier);

    return SupplierMapper.toResponseDto(savedSupplier);
  }

  async findAll(query: SupplierQueryDto) {
    const { page, limit, search } = query;

    const [suppliers, total] = await this.suppliersRepository.findPaginated(
      page,
      limit,
      search,
    );

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: SupplierMapper.toResponseDtoList(suppliers),
    };
  }

  async findOne(id: string) {
    const supplier = await this.suppliersRepository.findById(id);

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return SupplierMapper.toResponseDto(supplier);
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const supplier = await this.suppliersRepository.findById(id);

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    const { name } = updateSupplierDto;

    if (name !== undefined) {
      const existingSupplier = await this.suppliersRepository.findByName(name);

      if (existingSupplier && existingSupplier.id !== supplier.id) {
        throw new ConflictException('Supplier with this name already exists');
      }
    }

    this.suppliersRepository.merge(supplier, updateSupplierDto);

    const updatedSupplier = await this.suppliersRepository.save(supplier);

    return SupplierMapper.toResponseDto(updatedSupplier);
  }

  async remove(id: string) {
    const supplier = await this.suppliersRepository.findById(id);

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    await this.suppliersRepository.softDelete({ id });
  }
}
