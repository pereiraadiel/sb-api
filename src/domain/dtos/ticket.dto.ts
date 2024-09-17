import { TicketEntity } from '@/domain/entities/ticket.entity';

export type CreateTicketDto = Omit<TicketEntity, 'id'>;
