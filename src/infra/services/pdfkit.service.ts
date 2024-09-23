import { Readable } from 'stream';
import * as PDFKit from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
// import StreamToArray from 'stream-to-array';
const StreamToArray = require('stream-to-array');
import { Inject, Injectable } from '@nestjs/common';

import { PdfService } from '@/domain/services/pdf.service';
import { TicketEntity } from '@/domain/entities/ticket.entity';
import {
  QRCODE_SERVICE,
  QrcodeService,
} from '@/domain/services/qrcode.service';

@Injectable()
export class PdfkitService implements PdfService {
  private _stream: Readable;
  private document: PDFKit.PDFDocument;

  constructor(
    @Inject(QRCODE_SERVICE)
    private readonly qrcodeService: QrcodeService,
  ) {
    this._stream = new Readable();
    this.document = new PDFKit({
      margin: 10,
      size: 'A4',
      layout: 'portrait',
      permissions: {
        modifying: false,
      },
    });
  }

  getPages(tickets: TicketEntity[], pageSize = 16) {
    const pages: TicketEntity[][] = [];
    for (let i = 0; i < tickets.length; i += pageSize) {
      const chunk = tickets.slice(i, i + pageSize);
      pages.push(chunk);
    }

    return { pages, numberOfPages: pages.length };
  }

  async generatePdf(tickets: TicketEntity[]): Promise<PdfService> {
    this.document.pipe(
      fs.createWriteStream(
        path.resolve(__dirname, '..', '..', 'assets', 'tickets.pdf'),
      ),
    );

    const logoPath = path.resolve(__dirname, '..', '..', 'assets', `sb.png`);

    const { pages, numberOfPages } = this.getPages(tickets);

    for (let pageIndex = 0; pageIndex < numberOfPages; pageIndex++) {
      for (
        let ticketIndex = 0;
        ticketIndex < pages[pageIndex].length;
        ticketIndex++
      ) {
        await this.qrcodeService
          .generateCode(tickets[ticketIndex].physicalCode)
          .then(async (qr) => {
            const qrArrayBuffer = await StreamToArray(qr.stream);
            const qrBuffer = Buffer.concat(qrArrayBuffer);

            const colIndex = ticketIndex % 2;
            const rowIndex = Math.floor(ticketIndex / 2);

            this.document
              .image(qrBuffer, 57 + 250 * colIndex, 12 + 90 * rowIndex, {
                fit: [60, 60],
                align: 'center',
                valign: 'center',
              })
              .rect(50 + 250 * colIndex, 15 + 90 * rowIndex, 240, 80)
              .stroke();

            this.document
              .image(logoPath, 50 + 250 * colIndex, 61 + 90 * rowIndex, {
                fit: [70, 38],
                align: 'center',
                valign: 'center',
              })
              .stroke();

            this.document
              .fontSize(12)
              .text(
                `Bilhete: ${tickets[ticketIndex].physicalCode}`,
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
          });
      }
    }
    this.document.end();
    return this;
  }

  get stream() {
    return fs.createReadStream(
      path.resolve(__dirname, '..', '..', 'assets', 'tickets.pdf'),
    );
  }
}
