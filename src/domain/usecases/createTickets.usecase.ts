import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '@/domain/repositories/ticket.respository';
import { TicketEntity } from '@/domain/entities/ticket.entity';
import { generatePhysicalCode } from '@/domain/utils/generators.util';
import { ticketToResponseMapper } from '@/domain/mappers/ticketToResponse.mapper';
import { Inject, Injectable } from '@nestjs/common';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class CreateTicketsUsecase {
  constructor(
    @Inject(TICKET_REPOSITORY)
    private readonly ticketRepository: TicketRepository,
  ) {}

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
      throw new GenericError(
        'Erro ao criar bilhetes',
        'CreateTicketsUsecase',
      ).addCompleteError(error);
    }
  }
}
