import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';
import { Permissions } from 'src/common/decorators/permissions.decorator';

@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Permissions(PERMISSIONS.CATEGORIES.CREATE)
  @SuccessMessage('Category created successfully')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @Permissions(PERMISSIONS.CATEGORIES.READ)
  @SuccessMessage('Categories retrieved successfully')
  findAll(@Query() query: CategoryQueryDto) {
    return this.categoriesService.findAll(query);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.CATEGORIES.READ)
  @SuccessMessage('Category retrieved successfully')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.CATEGORIES.UPDATE)
  @SuccessMessage('Category updated successfully')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.CATEGORIES.DELETE)
  @SuccessMessage('Category deleted successfully')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
