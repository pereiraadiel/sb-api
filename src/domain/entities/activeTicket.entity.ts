import { generateId } from '@/domain/utils/generators.util';
import { TicketEntity } from './ticket.entity';
import { TicketCreditEntity } from './ticketCredit.entity';
import { TicketDebitEntity } from './ticketDebit.entity';

export class ActiveTicketEntity {
  id!: string;
  ticketId!: string;
  phoneNumber!: string;
  emoji!: string;
  activeUntil!: Date;
  createdAt!: Date;

  ticket?: TicketEntity;
  credits?: TicketCreditEntity[] = [];
  debits?: TicketDebitEntity[] = [];

  constructor(entity: ActiveTicketEntity, id?: string) {
    Object.assign(this, entity);
    this.id = id || generateId()
  }
}
