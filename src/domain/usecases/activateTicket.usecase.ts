import { Inject, Injectable } from '@nestjs/common';

import { EMOJIS } from '@/domain/utils/emoji.util';
import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '@/domain/repositories/ticket.respository';
import {
  ACTIVE_TICKET_REPOSITORY,
  ActiveTicketRepository,
} from '@/domain/repositories/activeTicket.repository';
import { activeTicketToResponseMapper } from '@/domain/mappers/activeTicketToResponse.mapper';
import { NotFoundError } from '@/domain/errors/notFound.error';
import { AlreadyExistsError } from '@/domain/errors/alreadyExists.error';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class ActivateTicketUsecase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private ticketRepository: TicketRepository,
    @Inject(ACTIVE_TICKET_REPOSITORY)
    private activeTicketRepository: ActiveTicketRepository,
  ) {}

  async execute(code: string, phoneNumber: string) {
    try {
      const ticket = await this.ticketRepository.findByCode(code);
      if (!ticket)
        throw new NotFoundError(
          'Bilhete não encontrado',
          'ActivateTicketUsecase',
        );

      const activeTickets = await this.activeTicketRepository.findMany({
        ticketId: ticket.id,
        activeUntil: {
          greaterThan: new Date(),
        },
      });
      if (activeTickets.length)
        throw new AlreadyExistsError(
          'Bilhete já ativado',
          'ActivateTicketUsecase',
        );

      const emoji =
        Object.keys(EMOJIS)[
          Math.floor(Math.random() * Object.keys(EMOJIS).length)
        ];
      const activeUntil = new Date();
      activeUntil.setDate(activeUntil.getDate() + 3); // valid for 3 days

      const activeTicket = await this.activeTicketRepository.create({
        ticketId: ticket.id,
        phoneNumber,
        emoji,
        activeUntil,
      });

      return {
        ...activeTicketToResponseMapper(activeTicket),
        emoji: activeTicket.emoji,
      };
    } catch (error) {
      if (
        error instanceof NotFoundError ||
        error instanceof AlreadyExistsError
      ) {
        throw error;
      }
      throw new GenericError(
        'Erro ao ativar bilhete',
        'ActivateTicketUsecase',
      ).addCompleteError(error);
    }
  }
}
