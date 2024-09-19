import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '@/domain/repositories/ticket.respository';
import { ticketToResponseMapper } from '@/domain/mappers/ticketToResponse.mapper';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetTicketByCodeUsecase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async execute(code: string) {
    try {
      const ticket = await this.ticketRepository.findByCode(code);

      if (!ticket) {
        throw new Error('Ticket not found');
      }

      return ticketToResponseMapper(ticket);
    } catch (error) {
      console.error('GetTicketByCodeUsecase: ', error);
      throw new Error(error.message);
    }
  }
}
