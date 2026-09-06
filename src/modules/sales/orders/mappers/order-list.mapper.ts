import { OrderListResponseDto } from '../dto';
import { Order } from '../entities/order.entity';

export class OrderListMapper {
  static toResponseDto(order: Order): OrderListResponseDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      status: order.status,
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  static toResponseDtoList(orders: Order[]): OrderListResponseDto[] {
    return orders.map((order) => this.toResponseDto(order));
  }
}
