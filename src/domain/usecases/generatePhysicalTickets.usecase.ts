import { PDF_SERVICE, PdfService } from '@/domain/services/pdf.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '@/domain/repositories/ticket.respository';

@Injectable()
export class GeneratePhysicalTicketsUsecase {
  constructor(
    @Inject(PDF_SERVICE)
    private readonly pdfService: PdfService,
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute() {
    try {
      const tickets = await this.ticketRepository.findMany();

      console.log('tickets.length', tickets.length);

      if (tickets.length === 0) {
        throw new Error('Não existem bilhetes cadastrados ainda!');
      }

      await this.pdfService.generatePdf(tickets);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
