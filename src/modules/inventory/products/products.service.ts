import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateProductDto, ProductQueryDto, UpdateProductDto } from './dto';
import { ProductMapper } from './mappers/product.mapper';
import { ProductsRepository } from './products.repository';

import { CategoriesRepository } from '../categories/categories.repository';
import { SuppliersRepository } from '../suppliers/suppliers.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly suppliersRepository: SuppliersRepository,
  ) {}

  async create(dto: CreateProductDto) {
    const { sku, categoryId, supplierId, ...data } = dto;

    await this.validateSkuAvailability(sku);

    const category = await this.getCategory(categoryId);
    const supplier = await this.getSupplier(supplierId);

    const product = this.productsRepository.create({
      ...data,
      sku,
      category,
      supplier,
    });

    const savedProduct = await this.productsRepository.save(product);

    const productWithRelations =
      await this.productsRepository.findByIdWithRelations(savedProduct.id);

    if (!productWithRelations) {
      throw new NotFoundException('Product not found');
    }

    return ProductMapper.toResponseDto(productWithRelations);
  }

  async findAll(query: ProductQueryDto) {
    const { page, limit, search, categoryId, supplierId } = query;

    const [products, total] = await this.productsRepository.findPaginated(
      page,
      limit,
      search,
      categoryId,
      supplierId,
    );

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: ProductMapper.toResponseDtoList(products),
    };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findByIdWithRelations(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return ProductMapper.toResponseDto(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { sku, categoryId, supplierId, ...data } = dto;

    if (sku !== undefined) {
      await this.validateSkuAvailability(sku, product.id);
    }

    if (categoryId !== undefined) {
      product.category = await this.getCategory(categoryId);
    }

    if (supplierId !== undefined) {
      product.supplier = await this.getSupplier(supplierId);
    }

    this.productsRepository.merge(product, data);

    await this.productsRepository.save(product);

    const updatedProduct =
      await this.productsRepository.findByIdWithRelations(id);

    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }

    return ProductMapper.toResponseDto(updatedProduct);
  }

  async remove(id: string) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.productsRepository.softDelete({ id });
  }

  private async validateSkuAvailability(
    sku: string,
    excludeProductId?: string,
  ) {
    const existingProduct = await this.productsRepository.findBySku(sku);

    if (existingProduct && existingProduct.id !== excludeProductId) {
      throw new ConflictException('Product with this SKU already exists');
    }
  }

  private async getCategory(categoryId: string) {
    const category = await this.categoriesRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  private async getSupplier(supplierId: string) {
    const supplier = await this.suppliersRepository.findById(supplierId);

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }
}
