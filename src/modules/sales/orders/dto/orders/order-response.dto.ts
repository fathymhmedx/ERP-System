import { OrderStatus } from '../../enums/order-status.enum';
import { OrderItemResponseDto } from '../order-items/order-item-response.dto';

export class OrderResponseDto {
  id!: string;
  orderNumber!: string;
  customerId!: string;
  status!: OrderStatus;

  subtotal!: string;
  discount!: string;
  total!: string;

  notes!: string | null;

  items!: OrderItemResponseDto[];

  createdAt!: Date;
  updatedAt!: Date;
}
