import { TicketRepository } from '@/domain/repositories/ticket.respository';
import { ticketToResponseMapper } from '@/domain/mappers/ticketToResponse.mapper';

export class GetTicketByCodeUsecase {
  constructor(private readonly ticketRepository: TicketRepository) {}

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
