import { OrderResponseDto } from '../dto';
import { Order } from '../entities/order.entity';

import { OrderItemMapper } from './order-item.mapper';

export class OrderMapper {
  static toResponseDto(order: Order): OrderResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      status: order.status,

      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,

      notes: order.notes,

      items: order.items ? OrderItemMapper.toResponseDtoList(order.items) : [],

      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toResponseDtoList(orders: Order[]): OrderResponseDto[] {
    return orders.map((order) => this.toResponseDto(order));
  }
}
