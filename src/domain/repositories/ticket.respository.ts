import { TicketEntity } from '@/domain/entities/ticket.entity';
import { CreateTicketDto } from '@/domain/dtos/ticket.dto';

export interface TicketRepository {
  create(ticket: CreateTicketDto): Promise<TicketEntity>;
  findByCode(code: string): Promise<TicketEntity | null>;
}
