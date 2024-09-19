import { TicketCreditEntity } from '@/domain/entities/ticketCredit.entity';
import {
  CreateTicketCreditDto,
  TicketCreditFiltersDto,
} from '@/domain/dtos/ticketCredit.dto';

export const TICKET_CREDIT_REPOSITORY = 'TICKET_CREDIT_REPOSITORY';

export interface TicketCreditRepository {
  create(ticketCredit: CreateTicketCreditDto): Promise<TicketCreditEntity>;
  findById(id: string): Promise<TicketCreditEntity | null>;
  findMany(filters: TicketCreditFiltersDto): Promise<TicketCreditEntity[]>;
}
