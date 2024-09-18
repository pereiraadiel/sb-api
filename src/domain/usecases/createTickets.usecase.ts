import { TicketRepository } from '@/domain/repositories/ticket.respository';
import { TicketEntity } from '@/domain/entities/ticket.entity';
import { generatePhysicalCode } from '@/domain/utils/generators.util';
import { ticketToResponseMapper } from '../mappers/ticketToResponse.mapper';

export class CreateTicketsUsecase {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async execute(quantity: number) {
    try {
      const tickets: TicketEntity[] = [];
      for (let i = 0; i < quantity; i++) {
        const ticket = await this.ticketRepository.create({
          physicalCode: generatePhysicalCode(),
        });
        tickets.push(ticket);
      }

      return tickets.map((ticket) => ticketToResponseMapper(ticket));
    } catch (error) {
      console.error('CreateTicketUsecase: ', error);
      throw new Error(error.message);
    }
  }
}
