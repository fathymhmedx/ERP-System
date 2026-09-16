import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import puppeteer, { Browser } from 'puppeteer';

import { Invoice } from '../entities/invoice.entity';
import { buildInvoiceHtml } from './invoice-pdf.template';

@Injectable()
export class InvoicePdfService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(InvoicePdfService.name);

  private browser: Browser | null = null;

  private browserLaunchPromise: Promise<Browser> | null = null;

  async onModuleInit(): Promise<void> {
    await this.getBrowser();
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.browser) {
      return;
    }

    await this.browser.close();

    this.browser = null;
  }

  private async getBrowser(): Promise<Browser> {
    if (this.browser?.connected) {
      return this.browser;
    }

    if (this.browserLaunchPromise) {
      return this.browserLaunchPromise;
    }

    this.browserLaunchPromise = puppeteer
      .launch({
        headless: true,

        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
        ],

        timeout: 30_000,
      })
      .then((browser) => {
        this.browser = browser;

        browser.on('disconnected', () => {
          this.logger.warn('Puppeteer browser disconnected');

          this.browser = null;
        });

        return browser;
      })
      .finally(() => {
        this.browserLaunchPromise = null;
      });

    return this.browserLaunchPromise;
  }

  async generate(invoice: Invoice): Promise<Buffer> {
    const browser = await this.getBrowser();

    const page = await browser.newPage();

    try {
      page.setDefaultTimeout(10_000);

      await page.setContent(buildInvoiceHtml(invoice), {
        waitUntil: 'load',
        timeout: 10_000,
      });

      await page.emulateMediaType('print');

      const pdf = await page.pdf({
        format: 'A4',

        printBackground: true,

        preferCSSPageSize: true,

        displayHeaderFooter: false,

        margin: {
          top: '18mm',
          right: '16mm',
          bottom: '18mm',
          left: '16mm',
        },

        timeout: 30_000,

        waitForFonts: true,
      });

      return Buffer.from(pdf);
    } catch (error) {
      this.logger.error(
        `Failed to generate PDF for invoice ${invoice.id}`,
        error instanceof Error ? error.stack : undefined,
      );

      throw new InternalServerErrorException('Failed to generate invoice PDF');
    } finally {
      await page.close();
    }
  }
}
