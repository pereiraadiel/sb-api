import { ActiveTicketEntity } from '@/domain/entities/activeTicket.entity';
import {
  ActiveTicketFiltersDto,
  CreateActiveTicketDto,
} from '@/domain/dtos/activeTicket.dto';

export interface ActiveTicketRepository {
  create(ticket: CreateActiveTicketDto): Promise<ActiveTicketEntity>;
  findMany(filters: ActiveTicketFiltersDto): Promise<ActiveTicketEntity[]>;
}
