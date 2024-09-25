import {
  TICKET_REPOSITORY,
  TicketRepository,
} from '@/domain/repositories/ticket.respository';
import { ticketToResponseMapper } from '@/domain/mappers/ticketToResponse.mapper';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '@/domain/errors/notFound.error';
import { GenericError } from '@/domain/errors/generic.error';

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
        throw new NotFoundError(
          'Bilhete não encontrado',
          'GetTicketByCodeUsecase',
        );
      }

      return ticketToResponseMapper(ticket);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new GenericError(
        'Erro ao buscar bilhete pelo código',
        'GetTicketByCodeUsecase',
      ).addCompleteError(error);
    }
  }
}
