import { Invoice } from '../entities/invoice.entity';
import { InvoiceItem } from '../entities/invoice-item.entity';

import { InvoiceResponseDto } from '../dto/invoice-response.dto';
import { InvoiceItemResponseDto } from '../dto/invoice-item-response.dto';

export class InvoiceMapper {
  static toItemResponseDto(invoiceItem: InvoiceItem): InvoiceItemResponseDto {
    return {
      id: invoiceItem.id,
      productId: invoiceItem.productId,
      productName: invoiceItem.productName,
      quantity: invoiceItem.quantity,
      unitPrice: invoiceItem.unitPrice,
      subtotal: invoiceItem.subtotal,
    };
  }

  static toResponseDto(invoice: Invoice): InvoiceResponseDto {
    return {
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,

      orderId: invoice.orderId,
      paymentId: invoice.paymentId,
      customerId: invoice.customerId,

      customerName: invoice.customerName,
      customerEmail: invoice.customerEmail,
      customerPhone: invoice.customerPhone,
      customerAddress: invoice.customerAddress,

      subtotal: invoice.subtotal,
      discount: invoice.discount,
      total: invoice.total,
      currency: invoice.currency,

      status: invoice.status,
      issuedAt: invoice.issuedAt,

      items: (invoice.items ?? []).map((item) =>
        InvoiceMapper.toItemResponseDto(item),
      ),

      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    };
  }

  static toResponseDtoList(invoices: Invoice[]): InvoiceResponseDto[] {
    return invoices.map((invoice) => InvoiceMapper.toResponseDto(invoice));
  }
}
