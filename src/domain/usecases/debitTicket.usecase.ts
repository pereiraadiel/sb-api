import { Inject, Injectable } from '@nestjs/common';

import { CreateTicketDebitDto } from '@/domain/dtos/ticketDebit.dto';
import { TICKET_DEBIT_REPOSITORY, TicketDebitRepository } from '@/domain/repositories/ticketDebit.respository';
import { ACTIVE_TICKET_REPOSITORY, ActiveTicketRepository } from '@/domain/repositories/activeTicket.repository';
import { SALE_STAND_GOOD_REPOSITORY, SaleStandGoodRepository } from '@/domain/repositories/saleStandGood.respository';
import { ticketDebitToResponseMapper } from '@/domain/mappers/ticketDebitToResponse.mapper';

@Injectable()
export class DebitTicketUsecase {
  constructor(
    @Inject(ACTIVE_TICKET_REPOSITORY)
    private readonly activeTicketRepository: ActiveTicketRepository,
    @Inject(TICKET_DEBIT_REPOSITORY)
    private readonly ticketDebitRepository: TicketDebitRepository,
    @Inject(SALE_STAND_GOOD_REPOSITORY)
    private readonly saleStandGoodRepository: SaleStandGoodRepository,
  ) {}

  async execute(ticket: CreateTicketDebitDto) {
    try {
      const [activeTickets, saleStandGood] = await Promise.all([
        this.activeTicketRepository.findMany({
          ticketId: ticket.activeTicketId,
          activeUntil: {
            greaterThan: new Date(),
          },
        }),
        this.saleStandGoodRepository.findById(ticket.saleStandGoodId),
      ]);

      if (!activeTickets.length) {
        throw new Error('Ticket not found');
      }

      if (!saleStandGood) {
        throw new Error('Sale Stand Good not found');
      }

      if (!saleStandGood.stock) {
        throw new Error('Sale Stand Good out of stock');
      }

      const [activeTicket] = activeTickets;

      const [newTicketDebit] = await Promise.all([
        this.ticketDebitRepository.create({
          ...ticket,
          activeTicketId: activeTicket.id,
        }),
        this.saleStandGoodRepository.updateStock(
          saleStandGood.id,
          saleStandGood.stock - 1,
        ),
      ]);

      return ticketDebitToResponseMapper(newTicketDebit);
    } catch (error) {
      console.error('DebitTicket: ', error);
      throw new Error(error.message);
    }
  }
}
