import { PaymentMethod } from '../../../enums/payment-method.enum';
import { CustomerBillingInfo } from './customer-billing-info.interface';

export interface CreatePaymentIntentParams {
  paymentId: string;
  orderId: string;
  amount: string;
  currency: string;
  method: PaymentMethod;
  customer?: CustomerBillingInfo;
}
