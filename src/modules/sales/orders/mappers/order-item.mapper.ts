import { OrderItemResponseDto } from '../dto';
import { OrderItem } from '../entities/order-item.entity';

export class OrderItemMapper {
  static toResponseDto(orderItem: OrderItem): OrderItemResponseDto {
    return {
      id: orderItem.id,
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      unitPrice: orderItem.unitPrice,
      subtotal: orderItem.subtotal,
    };
  }

  static toResponseDtoList(orderItems: OrderItem[]): OrderItemResponseDto[] {
    return orderItems.map((orderItem) => this.toResponseDto(orderItem));
  }
}
