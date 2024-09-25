import { PDF_SERVICE, PdfService } from '@/domain/services/pdf.service';
import { Inject, Injectable } from '@nestjs/common';
import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '@/domain/repositories/ticket.respository';
import { BadRequestError } from '@/domain/errors/badRequest.error';
import { GenericError } from '@/domain/errors/generic.error';

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
        throw new BadRequestError(
          'Não existem bilhetes cadastrados ainda!',
          'GeneratePhysicalTicketsUsecase',
        );
      }

      const pdfStream = (await this.pdfService.generatePdf(tickets)).stream;

      return pdfStream;
    } catch (error) {
      throw new GenericError(
        'Erro ao gerar bilhetes físicos',
        'GeneratePhysicalTicketsUsecase',
      ).addCompleteError(error);
    }
  }
}
