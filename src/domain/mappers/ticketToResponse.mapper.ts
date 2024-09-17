import { TicketEntity } from '@/domain/entities/ticket.entity';

export function ticketToResponseMapper(ticket: TicketEntity) {
  return {
    id: ticket.id,
    physicalCode: ticket.physicalCode,
  };
}
