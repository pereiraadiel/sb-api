import { ActiveTicketEntity } from '@/domain/entities/activeTicket.entity';
import {
  ActiveTicketFiltersDto,
  CreateActiveTicketDto,
} from '@/domain/dtos/activeTicket.dto';

export const ACTIVE_TICKET_REPOSITORY = 'ACTIVE_TICKET_REPOSITORY';
export interface ActiveTicketRepository {
  create(ticket: CreateActiveTicketDto): Promise<ActiveTicketEntity>;
  findMany(filters?: ActiveTicketFiltersDto): Promise<ActiveTicketEntity[]>;
  count(filters?: ActiveTicketFiltersDto): Promise<number>;
}
