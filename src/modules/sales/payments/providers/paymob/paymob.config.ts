import { ConfigService } from '@nestjs/config';
import type { PaymobConfig } from './interfaces/paymob-config.interface';

export const paymobConfig = {
  inject: [ConfigService],

  useFactory: (configService: ConfigService): PaymobConfig => ({
    secretKey: configService.getOrThrow<string>('PAYMOB_SECRET_KEY'),
    publicKey: configService.getOrThrow<string>('PAYMOB_PUBLIC_KEY'),
    hmacSecret: configService.getOrThrow<string>('PAYMOB_HMAC_SECRET'),
    cardIntegrationId: Number(
      configService.getOrThrow<string>('PAYMOB_CARD_INTEGRATION_ID'),
    ),
    notificationUrl: configService.getOrThrow<string>(
      'PAYMOB_NOTIFICATION_URL',
    ),
    redirectionUrl: configService.getOrThrow<string>('PAYMOB_REDIRECTION_URL'),
  }),
};
