import { TicketEntity } from '@/domain/entities/ticket.entity';

export function ticketToResponseMapper(ticket: TicketEntity) {
  console.log('ticketToResponseMapper ticket: ', ticket);
  return {
    id: ticket.id,
    physicalCode: ticket.physicalCode,
  };
}
