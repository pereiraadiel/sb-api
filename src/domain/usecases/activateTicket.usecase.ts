import { EMOJIS } from '@/domain/utils/emoji.util';
import { TicketRepository } from '@/domain/repositories/ticket.respository';
import { ActiveTicketRepository } from '@/domain/repositories/activeTicket.repository';

export class ActivateTicketUsecase {
  constructor(
    private ticketRepository: TicketRepository,
    private activeTicketRepository: ActiveTicketRepository,
  ) {}

  async execute(code: string, phoneNumber: string) {
    try {
      const ticket = await this.ticketRepository.findByCode(code);
      if (!ticket) throw new Error('Ticket not found');

      const activeTickets = await this.activeTicketRepository.findMany({
        ticketId: ticket.id,
        activeUntil: {
          greaterThan: new Date(),
        },
      });
      if (activeTickets.length) throw new Error('Ticket already activated');

      const emoji =
        Object.keys(EMOJIS)[
          Math.floor(Math.random() * Object.keys(EMOJIS).length)
        ];
      const activeUntil = new Date();
      activeUntil.setDate(activeUntil.getDate() + 30); // valid for 30 day

      const activeTicket = await this.activeTicketRepository.create({
        ticketId: ticket.id,
        phoneNumber,
        emoji,
        activeUntil,
      });

      return activeTicket;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
