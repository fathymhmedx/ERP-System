import { Body, Controller, Headers, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';
import { PaymobTransactionWebhookDto } from './dto';
import { RATE_LIMIT } from 'src/common/constants/rate-limit.constants';
import { Public } from 'src/common/decorators/public.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';

@Controller({
  path: 'payments',
  version: '1',
})
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @Throttle({ default: RATE_LIMIT.PAYMENTS.CREATE })
  @SuccessMessage('Payment created successfully')
  create(
    @Body() createPaymentDto: CreatePaymentDto,
    @Headers('idempotency-key') idempotencyKey: string,
  ) {
    return this.paymentsService.create(createPaymentDto, idempotencyKey);
  }

  @Post('webhook')
  @SuccessMessage('Webhook processed successfully')
  @Public()
  webhook(
    @Body() dto: PaymobTransactionWebhookDto,
    @Query('hmac') hmac: string,
  ) {
    return this.paymentsService.handleWebhook(dto, hmac);
  }
}
