import { Inject, Injectable } from '@nestjs/common';

import { CreateTicketCreditDto } from '@/domain/dtos/ticketCredit.dto';
import {
  TICKET_CREDIT_REPOSITORY,
  TicketCreditRepository,
} from '@/domain/repositories/ticketCredit.respository';
import {
  ACTIVE_TICKET_REPOSITORY,
  ActiveTicketRepository,
} from '@/domain/repositories/activeTicket.repository';
import { ticketCreditToResponseMapper } from '@/domain/mappers/ticketCreditToResponse.mapper';
import { BadRequestError } from '@/domain/errors/badRequest.error';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class CreditTicketUsecase {
  constructor(
    @Inject(ACTIVE_TICKET_REPOSITORY)
    private readonly activeTicketRepository: ActiveTicketRepository,
    @Inject(TICKET_CREDIT_REPOSITORY)
    private readonly ticketCreditRepository: TicketCreditRepository,
  ) {}

  async execute(ticket: CreateTicketCreditDto) {
    try {
      const activeTickets = await this.activeTicketRepository.findMany({
        ticketPhysicalCode: ticket.physicalCode,
        activeUntil: {
          greaterThan: new Date(),
        },
      });

      if (!activeTickets.length) {
        throw new BadRequestError('Bilhete não ativado', 'CreditTicketUsecase');
      }

      const [activeTicket] = activeTickets;

      if (activeTicket.activeUntil < new Date()) {
        throw new BadRequestError('Bilhete expirado', 'CreditTicketUsecase');
      }

      // se a diferença entre a data de expiração do bilhete e a data atual for menor que 1 hora não é possível creditar
      const maxDiffInMinutes =
        Number(process.env.MAX_EXPIRES_DIFF_IN_MINUTES) || 60;
      const now = new Date();
      const diff = activeTicket.activeUntil.getTime() - now.getTime();
      if (diff < 1000 * 60 * maxDiffInMinutes) {
        throw new BadRequestError(
          `Bilhete expira em menos de ${maxDiffInMinutes} minutos`,
          'CreditTicketUsecase',
        );
      }

      // creditos expiram em 72 horas ou na data de expiração do bilhete (o que ocorrer primeiro)
      const nowPlus72Hours = new Date(Date.now() + 1000 * 60 * 60 * 72);
      const expiresIn =
        nowPlus72Hours < activeTicket.activeUntil
          ? nowPlus72Hours
          : activeTicket.activeUntil;

      const newTicketCredit = await this.ticketCreditRepository.create({
        ...ticket,
        activeTicketId: activeTicket.id,
        expiresIn,
      });

      return ticketCreditToResponseMapper(newTicketCredit);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new GenericError(
        'Erro ao creditar bilhete',
        'CreditTicketUsecase',
      ).addCompleteError(error);
    }
  }
}
