import { Product } from '../entities/product.entity';
import { ProductResponseDto } from '../dto/product-response.dto';

export class ProductMapper {
  static toResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      sku: product.sku,
      description: product.description,

      category: {
        id: product.category.id,
        name: product.category.name,
      },

      supplier: {
        id: product.supplier.id,
        name: product.supplier.name,
        phone: product.supplier.phone,
      },

      costPrice: product.costPrice,
      sellingPrice: product.sellingPrice,
      currentStock: product.currentStock,
      reorderLevel: product.reorderLevel,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  static toResponseDtoList(products: Product[]): ProductResponseDto[] {
    return products.map((product) => this.toResponseDto(product));
  }
}
