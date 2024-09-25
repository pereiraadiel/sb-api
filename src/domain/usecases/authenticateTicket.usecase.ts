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

      // generate random token, store it in cache for 30 seconds and return it
      const token = generateToken(32);

      await this.cacheService.set(token, activeTicket.ticket.id, 30);

      return { token };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
