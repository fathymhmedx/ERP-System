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
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';

@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @SuccessMessage('Order created successfully')
  @Permissions(PERMISSIONS.ORDERS.CREATE)
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  @SuccessMessage('Orders retrieved successfully')
  @Permissions(PERMISSIONS.ORDERS.READ)
  findAll(@Query() query: OrderQueryDto) {
    return this.ordersService.findAll(query);
  }

  @Get(':id')
  @SuccessMessage('Order retrieved successfully')
  @Permissions(PERMISSIONS.ORDERS.READ)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @SuccessMessage('Order updated successfully')
  @Permissions(PERMISSIONS.ORDERS.UPDATE)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Patch(':id/cancel')
  @SuccessMessage('Order cancelled successfully')
  @Permissions(PERMISSIONS.ORDERS.CANCEL)
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.cancel(id);
  }

  @Post(':id/items')
  @SuccessMessage('Order item added successfully')
  @Permissions(PERMISSIONS.ORDERS.ADD_ITEM)
  addItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    return this.ordersService.addItem(id, createOrderItemDto);
  }

  @Patch(':id/items/:itemId')
  @SuccessMessage('Order item updated successfully')
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
  @SuccessMessage('Order item removed successfully')
  @Permissions(PERMISSIONS.ORDERS.REMOVE_ITEM)
  removeItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('itemId', ParseUUIDPipe) itemId: string,
  ) {
    return this.ordersService.removeItem(id, itemId);
  }

  @Post(':id/confirm')
  @SuccessMessage('Order confirmed successfully')
  @Permissions(PERMISSIONS.ORDERS.CONFIRM)
  confirm(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.confirm(id);
  }
}
