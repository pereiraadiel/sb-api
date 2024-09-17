import { TicketRepository } from '@/domain/repositories/ticket.respository';
import { ActiveTicketRepository } from '@/domain/repositories/activeTicket.repository';
import { EMOJIS } from '../utils/emoji.util';

export class GetTicketEmojisToAuthenticateUsecase {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly activeTicketRepository: ActiveTicketRepository,
  ) {}

  async execute(code: string): Promise<Set<keyof typeof EMOJIS>> {
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

      const emoji = activeTickets[0].emoji as keyof typeof EMOJIS;

      const emojis = new Set<keyof typeof EMOJIS>();
      emojis.add(emoji);

      for (let i = 0; i < 5; i++) {
        let randomEmoji = Object.keys(EMOJIS)[
          Math.floor(Math.random() * Object.keys(EMOJIS).length)
        ] as keyof typeof EMOJIS;

        while (emojis.has(randomEmoji)) {
          randomEmoji = Object.keys(EMOJIS)[
            Math.floor(Math.random() * Object.keys(EMOJIS).length)
          ] as keyof typeof EMOJIS;
        }

        emojis.add(randomEmoji);
      }

      return emojis;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
