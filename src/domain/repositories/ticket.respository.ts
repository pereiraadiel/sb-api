import { TicketEntity } from '@/domain/entities/ticket.entity';
import { CreateTicketDto } from '@/domain/dtos/ticket.dto';

export const TICKET_REPOSITORY = 'TICKET_REPOSITORY';

export interface TicketRepository {
  create(ticket: CreateTicketDto): Promise<TicketEntity>;
  findByCode(code: string): Promise<TicketEntity | null>;
  findById(id: string): Promise<TicketEntity | null>;
  findMany(): Promise<TicketEntity[]>;
  count(): Promise<number>;
}
