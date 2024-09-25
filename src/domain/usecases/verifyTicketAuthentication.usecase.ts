import { Inject, Injectable } from '@nestjs/common';

import { CACHE_SERVICE, CacheService } from '@/domain/services/cache.service';
import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '@/domain/repositories/ticket.respository';
import { TicketEntity } from '@/domain/entities/ticket.entity';

@Injectable()
export class VerifyTicketAuthenticationUsecase {
  constructor(
    @Inject(CACHE_SERVICE)
    private readonly cacheService: CacheService,
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(code: string): Promise<TicketEntity | false> {
    const ticketId = await this.cacheService.get(code);
    console.log('ticketId', ticketId);
    if (!ticketId) {
      return false;
    }

    const ticket = await this.ticketRepository.findById(ticketId);
    console.log('ticket', ticket);
    if (!ticket) {
      return false;
    }
    await this.cacheService.del(code);
    return ticket;
  }
}
