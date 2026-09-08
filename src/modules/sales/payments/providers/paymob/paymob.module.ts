import { Module } from '@nestjs/common';

import { paymobConfig } from 'src/modules/sales/payments/providers/paymob/paymob.config';

import { PaymobProvider } from './paymob.provider';
import { PaymobHmacService } from './paymob-hmac.service';

@Module({
  providers: [
    {
      provide: 'PAYMOB_CONFIG',
      ...paymobConfig,
    },
    PaymobProvider,
    PaymobHmacService,
  ],

  exports: [PaymobProvider, PaymobHmacService],
})
export class PaymobModule {}
