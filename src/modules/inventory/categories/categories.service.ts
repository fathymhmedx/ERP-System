import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { CategoryMapper } from './mappers/category.mapper';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;
    const existingCategory = await this.categoriesRepository.findByName(name);

    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = this.categoriesRepository.create(createCategoryDto);

    const savedCategory = await this.categoriesRepository.save(category);

    return CategoryMapper.toResponseDto(savedCategory);
  }

  async findAll(query: CategoryQueryDto) {
    const { page, limit, search } = query;

    const [categories, total] = await this.categoriesRepository.findPaginated(
      page,
      limit,
      search,
    );

    return {
      data: CategoryMapper.toResponseDtoList(categories),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return CategoryMapper.toResponseDto(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { name } = updateCategoryDto;
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (name !== undefined) {
      const existingCategory = await this.categoriesRepository.findByName(name);

      if (existingCategory && existingCategory.id !== category.id) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    this.categoriesRepository.merge(category, updateCategoryDto);

    const updatedCategory = await this.categoriesRepository.save(category);

    return CategoryMapper.toResponseDto(updatedCategory);
  }

  async remove(id: string) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoriesRepository.softDelete({ id });
  }
}
