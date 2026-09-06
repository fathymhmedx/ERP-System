import { OrderStatus } from '../../enums/order-status.enum';

export class OrderListResponseDto {
  id!: string;
  orderNumber!: string;
  customerId!: string;
  status!: OrderStatus;
  subtotal!: string;
  discount!: string;
  total!: string;
  createdAt!: Date;
  updatedAt!: Date;
}
