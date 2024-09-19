import { TicketDebitEntity } from '@/domain/entities/ticketDebit.entity';
import {
  CreateTicketDebitDto,
  TicketDebitFiltersDto,
} from '@/domain/dtos/ticketDebit.dto';

export const TICKET_DEBIT_REPOSITORY = 'TICKET_DEBIT_REPOSITORY';

export interface TicketDebitRepository {
  create(ticketDebit: CreateTicketDebitDto): Promise<TicketDebitEntity>;
  findById(id: string): Promise<TicketDebitEntity | null>;
  findMany(filters: TicketDebitFiltersDto): Promise<TicketDebitEntity[]>;
}
