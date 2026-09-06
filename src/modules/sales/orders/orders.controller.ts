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

import { OrdersService } from './orders.service';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';
import {
  CreateOrderDto,
  CreateOrderItemDto,
  OrderQueryDto,
  UpdateOrderDto,
  UpdateOrderItemDto,
} from './dto';

@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Permissions(PERMISSIONS.ORDERS.CREATE)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @Permissions(PERMISSIONS.ORDERS.READ)
  findAll(@Query() query: OrderQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.ORDERS.READ)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @Permissions(PERMISSIONS.ORDERS.UPDATE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/cancel')
  @Permissions(PERMISSIONS.ORDERS.CANCEL)
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.cancel(id);
  }

  @Post(':id/items')
  @Permissions(PERMISSIONS.ORDERS.ADD_ITEM)
  addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    return this.ordersService.addItem(id, createOrderItemDto);
  }

  @Patch(':id/items/:itemId')
  @Permissions(PERMISSIONS.ORDERS.UPDATE_ITEM)
  updateItemQuantity(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.ordersService.updateItemQuantity(
      id,
      itemId,
      updateOrderItemDto,
    );
  }

  @Delete(':id/items/:itemId')
  @Permissions(PERMISSIONS.ORDERS.REMOVE_ITEM)
  removeItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.ordersService.removeItem(id, itemId);
  }

  @Post(':id/confirm')
  @Permissions(PERMISSIONS.ORDERS.CONFIRM)
  confirm(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.confirm(id);
  }
}
