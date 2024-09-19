import { generateId } from '@/domain/utils/generators.util';
import { ActiveTicketEntity } from './activeTicket.entity';

export class TicketCreditEntity {
  id!: string;
  activeTicketId!: string;
  centsAmount!: number;
  expiresIn!: Date;
  createdAt!: Date;

  activeTicket?: ActiveTicketEntity;

  constructor(entity: TicketCreditEntity, id?: string) {
    Object.assign(this, entity);
    this.id = id || generateId()
  }
}
