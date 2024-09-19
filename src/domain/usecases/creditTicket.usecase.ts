import { CreateTicketCreditDto } from '@/domain/dtos/ticketCredit.dto';
import { TicketCreditRepository } from '@/domain/repositories/ticketCredit.respository';
import { ActiveTicketRepository } from '@/domain/repositories/activeTicket.repository';
import { ticketCreditToResponseMapper } from '@/domain/mappers/ticketCreditToResponse.mapper';

export class CreditTicket {
  constructor(
    private readonly activeTicketRepository: ActiveTicketRepository,
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
