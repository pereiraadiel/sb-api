import { GenericError } from '@/domain/errors/generic.error';
import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '@/domain/repositories/ticket.respository';
import { Inject, Injectable } from '@nestjs/common';
import {
  ACTIVE_TICKET_REPOSITORY,
  ActiveTicketRepository,
} from '@/domain/repositories/activeTicket.repository';

@Injectable()
export class GetTicketMetricsUsecase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
    @Inject(ACTIVE_TICKET_REPOSITORY)
    private readonly activeTicketRepository: ActiveTicketRepository,
  ) {}

  async execute() {
    try {
      const [totalTickets, totalActiveTickets] = await Promise.all([
        this.ticketRepository.count(),
        this.activeTicketRepository.count(),
      ]);

      return {
        totalTickets,
        totalActiveTickets,
      };
    } catch (error) {
      throw new GenericError(
        'Erro ao obter métricas de tickets',
        'GetTicketMetricsUsecase',
      ).addCompleteError(error);
    }
  }
}
