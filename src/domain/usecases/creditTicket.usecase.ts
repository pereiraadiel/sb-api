import { CreateTicketCreditDto } from '@/domain/dtos/ticketCredit.dto';
import { TICKET_CREDIT_REPOSITORY, TicketCreditRepository } from '@/domain/repositories/ticketCredit.respository';
import { ACTIVE_TICKET_REPOSITORY, ActiveTicketRepository } from '@/domain/repositories/activeTicket.repository';
import { ticketCreditToResponseMapper } from '@/domain/mappers/ticketCreditToResponse.mapper';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CreditTicketUsecase {
  constructor(
    @Inject(ACTIVE_TICKET_REPOSITORY)
    private readonly activeTicketRepository: ActiveTicketRepository,
    @Inject(TICKET_CREDIT_REPOSITORY)
    private readonly ticketCreditRepository: TicketCreditRepository,
  ) {}

  async execute(ticket: CreateTicketCreditDto) {
    try {
      const activeTickets = await this.activeTicketRepository.findMany({
        ticketId: ticket.activeTicketId,
        activeUntil: {
          greaterThan: new Date(),
        },
      });

      if (!activeTickets.length) {
        throw new Error('Ticket not found');
      }

      const [activeTicket] = activeTickets;

      // creditos expiram em 72 horas
      const expiresIn = new Date(Date.now() + 1000 * 60 * 60 * 72);

      const newTicketCredit = await this.ticketCreditRepository.create({
        ...ticket,
        activeTicketId: activeTicket.id,
        expiresIn,
      });

      return ticketCreditToResponseMapper(newTicketCredit);
    } catch (error) {
      console.error('CreditTicket: ', error);
      throw new Error(error.message);
    }
  }
}
