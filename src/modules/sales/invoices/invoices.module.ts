import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';

import { InvoicesRepository } from './repositories/invoices.repository';
import { InvoiceItemsRepository } from './repositories/invoice-items.repository';

import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';

import { OrdersModule } from '../orders/orders.module';
import { PaymentsModule } from '../payments/payments.module';
import { InvoicePdfService } from './pdf/invoice-pdf.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceItem]),
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [InvoicesController],
  providers: [
    InvoicesService,
    InvoicesRepository,
    InvoiceItemsRepository,
    InvoicePdfService,
  ],
  exports: [InvoicesService],
})
export class InvoicesModule {}
