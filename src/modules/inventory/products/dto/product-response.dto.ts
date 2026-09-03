import { SimpleCategoryDto } from 'src/common/dto/simple-category.dto';
import { SimpleSupplierDto } from 'src/common/dto/simple-supplier.dto';

export class ProductResponseDto {
  id!: string;

  name!: string;

  sku!: string;

  description!: string | null;

  category!: SimpleCategoryDto;

  supplier!: SimpleSupplierDto;

  costPrice!: string;

  sellingPrice!: string;

  currentStock!: number;

  reorderLevel!: number;

  createdAt!: Date;

  updatedAt!: Date;
}
