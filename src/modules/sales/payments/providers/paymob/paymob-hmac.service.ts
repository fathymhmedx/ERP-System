import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

import { PaymobTransactionWebhookDataDto } from '../../dto';
import type { PaymobConfig } from './interfaces/paymob-config.interface';

@Injectable()
export class PaymobHmacService {
  constructor(
    @Inject('PAYMOB_CONFIG')
    private readonly config: PaymobConfig,
  ) {}

  verifyTransaction(
    transaction: PaymobTransactionWebhookDataDto,
    receivedHmac: string,
  ): void {
    if (!receivedHmac || typeof receivedHmac !== 'string') {
      throw new UnauthorizedException('Invalid Paymob HMAC');
    }

    const values = [
      transaction.amount_cents,
      transaction.created_at,
      transaction.currency,
      transaction.error_occured,
      transaction.has_parent_transaction,
      transaction.id,
      transaction.integration_id,
      transaction.is_3d_secure,
      transaction.is_auth,
      transaction.is_capture,
      transaction.is_refunded,
      transaction.is_standalone_payment,
      transaction.is_voided,
      transaction.order.id,
      transaction.owner,
      transaction.pending,
      transaction.source_data.pan,
      transaction.source_data.sub_type,
      transaction.source_data.type,
      transaction.success,
    ];

    const payload = values.map(String).join('');

    const calculatedHmac = createHmac('sha512', this.config.hmacSecret)
      .update(payload)
      .digest('hex');

    const expected = Buffer.from(calculatedHmac, 'utf8');
    const received = Buffer.from(receivedHmac, 'utf8');

    if (
      expected.length !== received.length ||
      !timingSafeEqual(expected, received)
    ) {
      throw new UnauthorizedException('Invalid Paymob HMAC');
    }
  }

  validateIntegration(integrationId: number): void {
    if (integrationId !== this.config.cardIntegrationId) {
      throw new UnauthorizedException('Invalid Paymob integration ID');
    }
  }
}
