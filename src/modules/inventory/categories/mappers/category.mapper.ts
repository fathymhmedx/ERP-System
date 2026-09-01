import { Category } from '../entities/category.entity';
import { CategoryResponseDto } from '../dto/category-response.dto';

export class CategoryMapper {
  static toResponseDto(category: Category): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  static toResponseDtoList(categories: Category[]): CategoryResponseDto[] {
    return categories.map((category) => this.toResponseDto(category));
  }
}
