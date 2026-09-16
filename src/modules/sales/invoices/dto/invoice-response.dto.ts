import { InvoiceStatus } from '../enums/invoice-status.enum';

import { InvoiceItemResponseDto } from './invoice-item-response.dto';

export class InvoiceResponseDto {
  id!: string;
  invoiceNumber!: string;

  orderId!: string;
  paymentId!: string;
  customerId!: string;

  customerName!: string;
  customerEmail!: string | null;
  customerPhone!: string;
  customerAddress!: string | null;

  subtotal!: string;
  discount!: string;
  total!: string;
  currency!: string;

  status!: InvoiceStatus;
  issuedAt!: Date;

  items!: InvoiceItemResponseDto[];

  createdAt!: Date;
  updatedAt!: Date;
}
