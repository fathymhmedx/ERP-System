import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [CustomersModule, OrdersModule, PaymentsModule, InvoicesModule],
})
export class SalesModule {}
