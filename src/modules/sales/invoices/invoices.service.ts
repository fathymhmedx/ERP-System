import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { OrderStatus } from '../orders/enums/order-status.enum';

import { PaymentsRepository } from '../payments/payments.repository';

import { InvoicesRepository } from './repositories/invoices.repository';
import { InvoiceItemsRepository } from './repositories/invoice-items.repository';

import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';

import { InvoiceMapper } from './mappers/invoice.mapper';
import { InvoiceStatus } from './enums/invoice-status.enum';
import { OrdersRepository } from '../orders/repositories/orders.repository';
import { OrderItemsRepository } from '../orders/repositories/order-items.repository';
import { InvoicePdfService } from './pdf/invoice-pdf.service';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly paymentsRepository: PaymentsRepository,
    private readonly invoicesRepository: InvoicesRepository,
    private readonly invoiceItemsRepository: InvoiceItemsRepository,
    private readonly invoicePdfService: InvoicePdfService,
  ) {}

  async create(dto: CreateInvoiceDto): Promise<InvoiceResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      // 1. Lock the order
      const order = await this.ordersRepository.findByIdForUpdate(
        dto.orderId,
        manager,
      );

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // 2. Invoice can only be created for completed orders
      if (order.status !== OrderStatus.COMPLETED) {
        throw new BadRequestException(
          'Invoice can only be created for a completed order',
        );
      }

      // 3. Prevent duplicate invoice creation
      const existingInvoice = await this.invoicesRepository.findByOrderId(
        order.id,
        manager,
      );

      if (existingInvoice) {
        throw new BadRequestException(
          'An invoice already exists for this order',
        );
      }

      // 4. Get order with customer
      const orderWithCustomer =
        await this.ordersRepository.findByIdWithCustomerAndItems(
          order.id,
          manager,
        );

      if (!orderWithCustomer?.customer) {
        throw new NotFoundException(
          'Customer associated with the order was not found',
        );
      }

      // 5. Get order items with product data
      const orderItems =
        await this.orderItemsRepository.findByOrderIdWithProducts(
          order.id,
          manager,
        );

      if (!orderItems.length) {
        throw new BadRequestException(
          'Cannot create an invoice for an order without items',
        );
      }

      // 6. Get the successful payment
      const payment = await this.paymentsRepository.findPaidByOrderId(
        order.id,
        manager,
      );

      if (!payment) {
        throw new BadRequestException(
          'Cannot create an invoice without a successful payment',
        );
      }

      // 7. Generate invoice number
      const sequence =
        await this.invoicesRepository.getNextInvoiceNumberSequence(manager);

      const year = new Date().getFullYear();

      const invoiceNumber = `INV-${year}-${sequence
        .toString()
        .padStart(6, '0')}`;

      // 8. Create invoice snapshot
      const invoice = await this.invoicesRepository.createAndSave(manager, {
        invoiceNumber,

        orderId: order.id,
        paymentId: payment.id,
        customerId: orderWithCustomer.customer.id,

        customerName: `${orderWithCustomer.customer.firstName} ${orderWithCustomer.customer.lastName}`,
        customerEmail: orderWithCustomer.customer.email,
        customerPhone: orderWithCustomer.customer.phone,
        customerAddress: orderWithCustomer.customer.address,

        subtotal: order.subtotal,
        discount: order.discount,
        total: order.total,

        currency: 'EGP',
        status: InvoiceStatus.ISSUED,
        issuedAt: new Date(),
      });

      // 9. Create immutable invoice item snapshots
      const invoiceItems = orderItems.map((orderItem) => ({
        invoiceId: invoice.id,

        productId: orderItem.productId,
        productName: orderItem.product.name,

        quantity: orderItem.quantity,
        unitPrice: orderItem.unitPrice,
        subtotal: orderItem.subtotal,
      }));

      await this.invoiceItemsRepository.createAndSaveMany(
        manager,
        invoiceItems,
      );

      // 10. Reload invoice with items
      const createdInvoice = await this.invoicesRepository.findByIdWithItems(
        invoice.id,
        manager,
      );

      if (!createdInvoice) {
        throw new NotFoundException('Created invoice could not be retrieved');
      }

      return InvoiceMapper.toResponseDto(createdInvoice);
    });
  }

  async findById(id: string): Promise<InvoiceResponseDto> {
    const invoice = await this.invoicesRepository.findByIdWithItems(id);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return InvoiceMapper.toResponseDto(invoice);
  }

  async generatePdf(id: string): Promise<{
    buffer: Buffer;
    filename: string;
  }> {
    const invoice = await this.invoicesRepository.findByIdWithItems(id);

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    const buffer = await this.invoicePdfService.generate(invoice);

    return {
      buffer,
      filename: `${invoice.invoiceNumber}.pdf`,
    };
  }
}
