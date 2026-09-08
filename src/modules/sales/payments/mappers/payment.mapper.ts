import { Payment } from '../entities/payment.entity';
import { PaymentResponseDto } from '../dto/payment-response.dto';

export class PaymentMapper {
  static toResponseDto(payment: Payment): PaymentResponseDto {
    return {
      id: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      currency: payment.currency,
      provider: payment.provider,
      method: payment.method,
      status: payment.status,
      providerTransactionId: payment.providerTransactionId,
      clientSecret: payment.providerClientSecret,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }

  static toResponseDtoList(payments: Payment[]): PaymentResponseDto[] {
    return payments.map((payment) => this.toResponseDto(payment));
  }
}
