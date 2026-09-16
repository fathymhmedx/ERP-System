import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Invoice } from '../entities/invoice.entity';

const templatePath = join(__dirname, 'templates', 'invoice.html');

const invoiceTemplate = readFileSync(templatePath, 'utf8');

function escapeHtml(value: string | null | undefined): string {
  if (value == null) {
    return '';
  }

  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMoney(value: string, currency: string): string {
  const amount = Number(value);

  return `${amount.toFixed(2)} ${currency}`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function buildCustomerEmail(email: string | null): string {
  if (!email) {
    return '';
  }

  return `
    <div class="info-line">
      ${escapeHtml(email)}
    </div>
  `;
}

function buildCustomerAddress(address: string | null): string {
  if (!address) {
    return '';
  }

  return `
    <div class="info-line">
      ${escapeHtml(address)}
    </div>
  `;
}

function buildItems(invoice: Invoice): string {
  return (invoice.items ?? [])
    .map(
      (item, index) => `
        <tr>
          <td class="center">
            ${index + 1}
          </td>

          <td>
            <div class="product-name">
              ${escapeHtml(item.productName)}
            </div>
          </td>

          <td class="center">
            ${item.quantity}
          </td>

          <td class="amount">
            ${formatMoney(item.unitPrice, invoice.currency)}
          </td>

          <td class="amount">
            ${formatMoney(item.subtotal, invoice.currency)}
          </td>
        </tr>
      `,
    )
    .join('');
}

export function buildInvoiceHtml(invoice: Invoice): string {
  return invoiceTemplate
    .replaceAll('{{invoiceNumber}}', escapeHtml(invoice.invoiceNumber))
    .replaceAll('{{issuedAt}}', escapeHtml(formatDate(invoice.issuedAt)))
    .replaceAll('{{customerName}}', escapeHtml(invoice.customerName))
    .replaceAll('{{customerEmail}}', buildCustomerEmail(invoice.customerEmail))
    .replaceAll('{{customerPhone}}', escapeHtml(invoice.customerPhone))
    .replaceAll(
      '{{customerAddress}}',
      buildCustomerAddress(invoice.customerAddress),
    )
    .replaceAll('{{status}}', escapeHtml(invoice.status))
    .replaceAll('{{items}}', buildItems(invoice))
    .replaceAll('{{subtotal}}', formatMoney(invoice.subtotal, invoice.currency))
    .replaceAll('{{discount}}', formatMoney(invoice.discount, invoice.currency))
    .replaceAll('{{total}}', formatMoney(invoice.total, invoice.currency));
}
