import { TicketCreditEntity } from '@/domain/entities/ticketCredit.entity';
import { activeTicketToResponseMapper } from './activeTicketToResponse.mapper';

export function ticketCreditToResponseMapper(ticketCredit: TicketCreditEntity) {
  return {
    id: ticketCredit.id,
    ticket: activeTicketToResponseMapper(ticketCredit.activeTicket),
    centsAmount: ticketCredit.centsAmount,
    expiresIn: ticketCredit.expiresIn,
    createdAt: ticketCredit.createdAt,
  };
}
