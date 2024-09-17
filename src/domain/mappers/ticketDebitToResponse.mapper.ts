import { TicketDebitEntity } from '@/domain/entities/ticketDebit.entity';
import { activeTicketToResponseMapper } from './activeTicketToResponse.mapper';

export function ticketDebitToResponseMapper(ticketDebit: TicketDebitEntity) {
  return {
    id: ticketDebit.id,
    ticket: activeTicketToResponseMapper(ticketDebit.activeTicket),
    centsAmount: ticketDebit.centsAmount,
    createdAt: ticketDebit.createdAt,
  };
}
