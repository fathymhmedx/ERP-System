import { Inject, Injectable } from '@nestjs/common';

import axios from 'axios';
import type { AxiosInstance } from 'axios';

import Decimal from 'decimal.js';
import type { PaymobConfig } from './interfaces/paymob-config.interface';
import { CreatePaymentIntentParams } from './interfaces/create-payment-intent-params.interface';
import { CreatePaymentIntentResult } from './interfaces/create-payment-intent-result.interface';
import { PaymobPaymentIntentResponse } from './interfaces/paymob-payment-intent-response.interface';

@Injectable()
export class PaymobProvider {
  private readonly client: AxiosInstance;

  constructor(
    @Inject('PAYMOB_CONFIG')
    private readonly config: PaymobConfig,
  ) {
    this.client = axios.create({
      baseURL: 'https://accept.paymob.com',
      timeout: 10_000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async createPaymentIntent(
    params: CreatePaymentIntentParams,
  ): Promise<CreatePaymentIntentResult> {
    const { secretKey, cardIntegrationId, notificationUrl, redirectionUrl } =
      this.config;

    const amountCents = new Decimal(params.amount).times(100).toNumber();

    const response = await this.client.post<PaymobPaymentIntentResponse>(
      '/v1/intention/',
      {
        amount: amountCents,
        currency: params.currency,
        payment_methods: [cardIntegrationId],
        special_reference: params.paymentId,
        notification_url: notificationUrl,
        redirection_url: redirectionUrl,
        billing_data: {
          first_name: params.customer?.firstName || 'Customer',
          last_name: params.customer?.lastName || 'Name',
          email: params.customer?.email || 'customer@example.com',
          phone_number: params.customer?.phone || '+201000000000',
        },
      },
      {
        headers: {
          Authorization: `Token ${secretKey}`,
        },
      },
    );

    return {
      intentionId: String(response.data.id),
      providerOrderId: String(response.data.intention_order_id),
      clientSecret: response.data.client_secret,
    };
  }
}
