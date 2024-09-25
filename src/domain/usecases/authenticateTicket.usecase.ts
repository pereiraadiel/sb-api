import { Inject, Injectable } from '@nestjs/common';

import {
  ACTIVE_TICKET_REPOSITORY,
  ActiveTicketRepository,
} from '@/domain/repositories/activeTicket.repository';
import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '@/domain/repositories/ticket.respository';
import { CACHE_SERVICE, CacheService } from '@/domain/services/cache.service';
import { generateToken } from '@/domain/utils/generators.util';
import { NotFoundError } from '@/domain/errors/notFound.error';
import { BadRequestError } from '@/domain/errors/badRequest.error';
import { UnauthorizedError } from '@/domain/errors/unauthorized.error';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class AuthenticateTicketUsecase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(ACTIVE_TICKET_REPOSITORY)
    private readonly activeTicketRepository: ActiveTicketRepository,
    @Inject(CACHE_SERVICE)
    private readonly cacheService: CacheService,
  ) {}

  async execute(code: string, emoji: string) {
    try {
      const ticket = await this.ticketRepository.findByCode(code);
      if (!ticket) {
        throw new NotFoundError(
          'Bilhete não encontrado',
          'AuthenticateTicketUsecase',
        );
      }

      const activeTickets = await this.activeTicketRepository.findMany({
        ticketId: ticket.id,
        activeUntil: {
          greaterThan: new Date(),
        },
      });

      if (activeTickets.length === 0) {
        throw new BadRequestError(
          'Bilhete não ativado',
          'AuthenticateTicketUsecase',
        );
      }

      const activeTicket = activeTickets[0];
      if (activeTicket.emoji !== emoji) {
        throw new UnauthorizedError(
          'Emoji inválido',
          'AuthenticateTicketUsecase',
        );
      }

      // generate random token, store it in cache for 30 seconds and return it
      const token = generateToken(32);

      await this.cacheService.set(token, activeTicket.ticket.id, 30);

      return { token };
    } catch (error) {
      if (
        error instanceof NotFoundError ||
        error instanceof BadRequestError ||
        error instanceof UnauthorizedError
      ) {
        throw error;
      }
      throw new GenericError(
        'Erro ao autenticar bilhete',
        'AuthenticateTicketUsecase',
      ).addCompleteError(error);
    }
  }
}
