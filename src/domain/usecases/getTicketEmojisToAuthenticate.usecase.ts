import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '@/domain/repositories/ticket.respository';
import {
  ACTIVE_TICKET_REPOSITORY,
  ActiveTicketRepository,
} from '@/domain/repositories/activeTicket.repository';
import { EMOJIS } from '@/domain/utils/emoji.util';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '@/domain/errors/notFound.error';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class GetTicketEmojisToAuthenticateUsecase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(ACTIVE_TICKET_REPOSITORY)
    private readonly activeTicketRepository: ActiveTicketRepository,
  ) {}

  async execute(code: string): Promise<Set<keyof typeof EMOJIS>> {
    try {
      const ticket = await this.ticketRepository.findByCode(code);

      if (!ticket) {
        throw new NotFoundError(
          'Ticket not found',
          'GetTicketEmojisToAuthenticateUsecase',
        );
      }

      const activeTickets = await this.activeTicketRepository.findMany({
        ticketId: ticket.id,
        activeUntil: {
          greaterThan: new Date(),
        },
      });

      if (activeTickets.length === 0) {
        throw new NotFoundError(
          'Ticket not found',
          'GetTicketEmojisToAuthenticateUsecase',
        );
      }

      const emoji = activeTickets[0].emoji as keyof typeof EMOJIS;

      const emojis = new Set<keyof typeof EMOJIS>();
      emojis.add(emoji);

      console.log(emojis);

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
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new GenericError(
        'Erro ao buscar emojis para autenticar bilhete',
        'GetTicketEmojisToAuthenticateUsecase',
      ).addCompleteError(error);
    }
  }
}
