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

import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersService } from './customers.service';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';

@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @SuccessMessage('Customer created successfully')
  @Permissions(PERMISSIONS.CUSTOMERS.CREATE)
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @SuccessMessage('Customers retrieved successfully')
  @Permissions(PERMISSIONS.CUSTOMERS.READ)
  findAll(@Query() query: CustomerQueryDto) {
    return this.customersService.findAll(query);
  }

  @Get(':id')
  @SuccessMessage('Customer retrieved successfully')
  @Permissions(PERMISSIONS.CUSTOMERS.READ)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  @Patch(':id')
  @SuccessMessage('Customer updated successfully')
  @Permissions(PERMISSIONS.CUSTOMERS.UPDATE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @SuccessMessage('Customer deleted successfully')
  @Permissions(PERMISSIONS.CUSTOMERS.DELETE)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.remove(id);
  }
}
