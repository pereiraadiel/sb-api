import { TicketCreditEntity } from '@/domain/entities/ticketCredit.entity';
import {
  CreateTicketCreditDto,
  TicketCreditFiltersDto,
} from '@/domain/dtos/ticketCredit.dto';

export interface TicketCreditRepository {
  create(ticketCredit: CreateTicketCreditDto): Promise<TicketCreditEntity>;
  findById(id: string): Promise<TicketCreditEntity | null>;
  findMany(filters: TicketCreditFiltersDto): Promise<TicketCreditEntity[]>;
}
