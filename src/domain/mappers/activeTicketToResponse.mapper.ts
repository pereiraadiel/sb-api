import { ActiveTicketEntity } from '@/domain/entities/activeTicket.entity';
import { ticketToResponseMapper } from './ticketToResponse.mapper';

export function activeTicketToResponseMapper(activeTicket: ActiveTicketEntity) {
  return {
    id: activeTicket.id,
    ticket: ticketToResponseMapper(activeTicket.ticket),
    createdAt: activeTicket.createdAt,
  };
}
