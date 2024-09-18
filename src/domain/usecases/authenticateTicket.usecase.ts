import { ActiveTicketRepository } from '@/domain/repositories/activeTicket.repository';
import { TicketRepository } from '@/domain/repositories/ticket.respository';
import { activeTicketToResponseMapper } from '@/domain/mappers/activeTicketToResponse.mapper';

export class AuthenticateTicketUsecase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly activeTicketRepository: ActiveTicketRepository,
  ) {}

  async execute(code: string, emoji: string) {
    try {
      const ticket = await this.ticketRepository.findByCode(code);
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      const activeTickets = await this.activeTicketRepository.findMany({
        ticketId: ticket.id,
        activeUntil: {
          greaterThan: new Date(),
        },
      });

      if (activeTickets.length === 0) {
        throw new Error('Ticket not found');
      }

      const activeTicket = activeTickets[0];
      if (activeTicket.emoji !== emoji) {
        throw new Error('Invalid emoji');
      }

      return activeTicketToResponseMapper(activeTicket);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
