import { CreateTicketDebitDto } from '@/domain/dtos/ticketDebit.dto';
import { TicketDebitRepository } from '@/domain/repositories/ticketDebit.respository';
import { ActiveTicketRepository } from '@/domain/repositories/activeTicket.repository';
import { ticketDebitToResponseMapper } from '@/domain/mappers/ticketDebitToResponse.mapper';

export class DebitTicket {
  constructor(
    private readonly activeTicketRepository: ActiveTicketRepository,
    private readonly ticketDebitRepository: TicketDebitRepository,
  ) {}

  async execute(ticket: CreateTicketDebitDto) {
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

      const newTicketDebit = await this.ticketDebitRepository.create({
        ...ticket,
        activeTicketId: activeTicket.id,
      });

      return ticketDebitToResponseMapper(newTicketDebit);
    } catch (error) {
      console.error('DebitTicket: ', error);
      throw new Error(error.message);
    }
  }
}
