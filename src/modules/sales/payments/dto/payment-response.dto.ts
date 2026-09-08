import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentProvider } from '../enums/payment-provider.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export class PaymentResponseDto {
  id!: string;
  orderId!: string;
  amount!: string;
  currency!: string;
  provider!: PaymentProvider;
  method!: PaymentMethod;
  status!: PaymentStatus;
  providerTransactionId!: string | null;
  clientSecret!: string | null;
  paidAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
