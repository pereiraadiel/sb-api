import { Readable } from 'stream';
import { TicketEntity } from '@/domain/entities/ticket.entity';

export const PDF_SERVICE = 'PDF_SERVICE';

export interface PdfService {
  generatePdf(tickets: TicketEntity[]): Promise<PdfService>;
  stream: Readable;
}
