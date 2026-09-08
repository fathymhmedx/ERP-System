import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Payment } from './entities/payment.entity';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';
import { PaymobModule } from './providers/paymob/paymob.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), PaymobModule, OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, PaymentsRepository],
  exports: [PaymentsRepository, PaymentsService],
})
export class PaymentsModule {}
