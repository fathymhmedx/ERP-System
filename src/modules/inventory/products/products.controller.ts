import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';

import { CreateProductDto, ProductQueryDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Permissions(PERMISSIONS.PRODUCTS.CREATE)
  @SuccessMessage('Product created successfully')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Permissions(PERMISSIONS.PRODUCTS.READ)
  @SuccessMessage('Products retrieved successfully')
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.PRODUCTS.READ)
  @SuccessMessage('Product retrieved successfully')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.PRODUCTS.UPDATE)
  @SuccessMessage('Product updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.PRODUCTS.DELETE)
  @SuccessMessage('Product deleted successfully')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
