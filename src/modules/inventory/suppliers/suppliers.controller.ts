import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import { SuppliersService } from './suppliers.service';
import { CreateSupplierDto, SupplierQueryDto, UpdateSupplierDto } from './dto';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';

@Controller({
  path: 'suppliers',
  version: '1',
})
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @Permissions(PERMISSIONS.SUPPLIERS.CREATE)
  @SuccessMessage('Supplier created successfully')
  create(@Body() createSupplierDto: CreateSupplierDto) {
    return this.suppliersService.create(createSupplierDto);
  }

  @Get()
  @Permissions(PERMISSIONS.SUPPLIERS.READ)
  @SuccessMessage('Suppliers retrieved successfully')
  findAll(@Query() query: SupplierQueryDto) {
    return this.suppliersService.findAll(query);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.SUPPLIERS.READ)
  @SuccessMessage('Supplier retrieved successfully')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.suppliersService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.SUPPLIERS.UPDATE)
  @SuccessMessage('Supplier updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  @Permissions(PERMISSIONS.SUPPLIERS.DELETE)
  @SuccessMessage('Supplier deleted successfully')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.suppliersService.remove(id);
  }
}
