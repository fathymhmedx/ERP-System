import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
} from '@nestjs/common';

import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceResponseDto } from './dto/invoice-response.dto';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';
import { Permissions } from 'src/common/decorators/permissions.decorator';
import type { Response } from 'express';

@Controller({
  path: 'invoices',
  version: '1',
})
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @Permissions(PERMISSIONS.INVOICES.GENERATE)
  @SuccessMessage('Invoice created successfully')
  async create(@Body() dto: CreateInvoiceDto): Promise<InvoiceResponseDto> {
    return this.invoicesService.create(dto);
  }

  @Get(':id')
  @Permissions(PERMISSIONS.INVOICES.READ)
  @SuccessMessage('Invoice retrieved successfully')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<InvoiceResponseDto> {
    return this.invoicesService.findById(id);
  }

  @Get(':id/pdf')
  @Permissions(PERMISSIONS.INVOICES.PDF)
  @SuccessMessage('Invoice PDF generated successfully')
  async generatePdf(
    @Param('id', ParseUUIDPipe) id: string,
    @Res() response: Response,
  ): Promise<void> {
    const { buffer, filename } = await this.invoicesService.generatePdf(id);

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Content-Length': buffer.length,
      'Cache-Control': 'private, no-store',
    });

    response.end(buffer);
  }
}
