import { Readable, PassThrough } from 'stream';
import * as PDFKit from 'pdfkit';
import * as path from 'path';
import { Inject, Injectable } from '@nestjs/common';

import { PdfService } from '@/domain/services/pdf.service';
import { TicketEntity } from '@/domain/entities/ticket.entity';
import {
  QRCODE_SERVICE,
  QrcodeService,
} from '@/domain/services/qrcode.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const StreamToArray = require('stream-to-array');

@Injectable()
export class PdfkitService implements PdfService {
  private _stream: Readable;
  private document: PDFKit.PDFDocument;

  constructor(
    @Inject(QRCODE_SERVICE)
    private readonly qrcodeService: QrcodeService,
  ) {
    this.reset();
  }

  private reset() {
    this.document = new PDFKit({
      margin: 10,
      size: 'A4',
      layout: 'portrait',
      permissions: { modifying: false },
    });
    this._stream = new Readable();
  }

  getPages(tickets: TicketEntity[], pageSize = 16) {
    const pages = [];
    for (let i = 0; i < tickets.length; i += pageSize) {
      pages.push(tickets.slice(i, i + pageSize));
    }
    return { pages, numberOfPages: pages.length };
  }

  async generatePdf(tickets: TicketEntity[]): Promise<PdfService> {
    this.reset();
    this._stream = this.document.pipe(new PassThrough());
    const logoPath = path.resolve(__dirname, '..', '..', 'assets', `sb.png`);
    const pageSize = 18;
    const { pages, numberOfPages } = this.getPages(tickets, pageSize);

    for (let pageIndex = 0; pageIndex < numberOfPages; pageIndex++) {
      const currentPageTickets = pages[pageIndex];
      for (
        let ticketIndex = 0;
        ticketIndex < currentPageTickets.length;
        ticketIndex++
      ) {
        const ticket = currentPageTickets[ticketIndex];
        const colIndex = ticketIndex % 2;
        const rowIndex = Math.floor(ticketIndex / 2);

        const qrBuffer = await this.getQrBuffer(ticket.physicalCode);

        this.renderQrCode(qrBuffer, colIndex, rowIndex);
        this.renderLogo(logoPath, colIndex, rowIndex);
        this.renderTicketInfo(ticket.physicalCode, colIndex, rowIndex);
      }

      this.document
        .fontSize(6)
        .text(
          `Página ${pageIndex + 1}/${numberOfPages}`,
          this.document.page.width / 2 - 20,
          this.document.page.height - 18,
        );
      if (pageIndex + 1 < numberOfPages) {
        this.document.addPage();
      }
    }
    this.document.end();
    return this;
  }

  private async getQrBuffer(physicalCode: string): Promise<Buffer> {
    const qr = await this.qrcodeService.generateCode(physicalCode);
    const qrArrayBuffer = await StreamToArray(qr.stream);
    return Buffer.concat(qrArrayBuffer);
  }

  private renderQrCode(qrBuffer: Buffer, colIndex: number, rowIndex: number) {
    this.document
      .image(qrBuffer, 57 + 250 * colIndex, 12 + 90 * rowIndex, {
        fit: [60, 60],
        align: 'center',
        valign: 'center',
      })
      .rect(50 + 250 * colIndex, 15 + 90 * rowIndex, 240, 80)
      .stroke();
  }

  private renderLogo(logoPath: string, colIndex: number, rowIndex: number) {
    this.document
      .image(logoPath, 50 + 250 * colIndex, 61 + 90 * rowIndex, {
        fit: [70, 38],
        align: 'center',
        valign: 'center',
      })
      .stroke();
  }

  private renderTicketInfo(
    physicalCode: string,
    colIndex: number,
    rowIndex: number,
  ) {
    this.document
      .fontSize(12)
      .text(
        `Bilhete: ${physicalCode}`,
        130 + 250 * colIndex,
        25 + 90 * rowIndex,
      )
      .fillColor('black');

    this.document
      .fontSize(6)
      .text(
        `O saldo do bilhete é válido por 72 horas`,
        130 + 250 * colIndex,
        38 + 90 * rowIndex,
      )
      .fillColor('black');

    this.document
      .fontSize(6)
      .text(
        `Atenção, lembre-se do emoji associado ao bilhete, \nvocê precisará informá-lo nas barraquinhas`,
        130 + 250 * colIndex,
        78 + 90 * rowIndex,
      )
      .fillColor('black');
  }

  get stream() {
    return this._stream;
  }
}
