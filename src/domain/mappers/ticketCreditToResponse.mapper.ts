import { TicketCreditEntity } from '@/domain/entities/ticketCredit.entity';

export function ticketCreditToResponseMapper(ticketCredit: TicketCreditEntity) {
  return {
    id: ticketCredit.id,
    ticket: ticketCredit.activeTicket.ticket.physicalCode,
    centsAmount: ticketCredit.centsAmount,
    expiresIn: ticketCredit.expiresIn,
    createdAt: ticketCredit.createdAt,
  };
}
