import { ACTIVE_TICKET_REPOSITORY, ActiveTicketRepository } from '@/domain/repositories/activeTicket.repository';
import { TICKET_CREDIT_REPOSITORY, TicketCreditRepository } from '@/domain/repositories/ticketCredit.respository';
import { TICKET_DEBIT_REPOSITORY, TicketDebitRepository } from '@/domain/repositories/ticketDebit.respository';
import { Inject, Injectable } from '@nestjs/common';

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

  async execute(activeTicketId: string): Promise<number> {
    try {
      const activeTickets = await this.activeTicketRepository.findMany({
        ticketId: activeTicketId,
        activeUntil: {
          greaterThan: new Date(),
        },
      });

      if (!activeTickets.length) {
        throw new Error('Ticket not found');
      }

      const [ticket] = activeTickets;

      const ticketCredits = await this.ticketCreditRepository.findMany({
        activeTicketId: ticket.id,
        expiresIn: { greaterThan: new Date() },
      });

      // menor data de criação de um credito ativo
      const earliestCreditDate = ticketCredits.reduce(
        (acc, ticketCredit) =>
          ticketCredit.createdAt < acc ? ticketCredit.createdAt : acc,
        ticketCredits[0].createdAt,
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

      return ticketCreditTotal - ticketDebitTotal;
    } catch (error) {
      console.error('GetActiveTicketBalanceUsecase: ', error);
      throw new Error(error.message);
    }
  }
}
