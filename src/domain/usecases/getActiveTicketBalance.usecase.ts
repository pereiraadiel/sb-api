import {
  ACTIVE_TICKET_REPOSITORY,
  ActiveTicketRepository,
} from '@/domain/repositories/activeTicket.repository';
import {
  TICKET_CREDIT_REPOSITORY,
  TicketCreditRepository,
} from '@/domain/repositories/ticketCredit.respository';
import {
  TICKET_DEBIT_REPOSITORY,
  TicketDebitRepository,
} from '@/domain/repositories/ticketDebit.respository';
import { Inject, Injectable } from '@nestjs/common';
import { BadRequestError } from '@/domain/errors/badRequest.error';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class GetActiveTicketBalanceUsecase {
  constructor(
    @Inject(ACTIVE_TICKET_REPOSITORY)
    private readonly activeTicketRepository: ActiveTicketRepository,
    @Inject(TICKET_CREDIT_REPOSITORY)
    private readonly ticketCreditRepository: TicketCreditRepository,
    @Inject(TICKET_DEBIT_REPOSITORY)
    private readonly ticketDebitRepository: TicketDebitRepository,
  ) {}

  async execute(code: string) {
    try {
      const activeTickets = await this.activeTicketRepository.findMany({
        ticketPhysicalCode: code,
        activeUntil: {
          greaterThan: new Date(),
        },
      });

      if (!activeTickets.length) {
        throw new BadRequestError(
          'Bilhete não ativado',
          'GetActiveTicketBalanceUsecase',
        );
      }

      const [ticket] = activeTickets;

      // const ticketCredits = await this.ticketCreditRepository.findMany({
      //   expiresIn: { greaterThan: new Date() },
      //   createdAt: { greaterThan: ticket.createdAt },
      //   physicalCode: ticket.ticket.physicalCode,
      // });

      const ticketCredits = ticket.credits.filter(
        (item) =>
          item.expiresIn > new Date() && item.createdAt > ticket.createdAt,
      );

      console.log('ticketCredits', ticketCredits, ticket);

      if (ticketCredits.length === 0) {
        return {
          balance: 0,
          expiresIn: ticket.activeUntil,
        };
      }

      // menor data de criação de um credito ativo
      const earliestCreditDate = ticketCredits.reduce(
        (acc, ticketCredit) =>
          ticketCredit.createdAt < acc ? ticketCredit.createdAt : acc,
        new Date(),
      );

      const ticketDebits = await this.ticketDebitRepository.findMany({
        activeTicketId: ticket.id,
        createdAt: {
          greaterThan: earliestCreditDate,
        },
      });

      const ticketDebitTotal = ticketDebits.reduce(
        (acc, ticketDebit) => acc + ticketDebit.centsAmount,
        0,
      );

      const ticketCreditTotal = ticketCredits.reduce(
        (acc, ticketCredit) => acc + ticketCredit.centsAmount,
        0,
      );

      const balance = ticketCreditTotal - ticketDebitTotal;

      return {
        balance,
        expiresIn: ticket.activeUntil,
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new GenericError(
        'Erro ao obter o saldo do bilhete',
        'GetActiveTicketBalanceUsecase',
      ).addCompleteError(error);
    }
  }
}
