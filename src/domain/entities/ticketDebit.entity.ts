import { generateId } from '@/domain/utils/generators.util';
import { ActiveTicketEntity } from './activeTicket.entity';
import { SaleStandGoodEntity } from './saleStandGood.entity';

export class TicketDebitEntity {
  id!: string;
  activeTicketId!: string;
  centsAmount!: number;
  saleStandGoodId!: string;
  createdAt!: Date;

  activeTicket?: ActiveTicketEntity;
  good?: SaleStandGoodEntity;

  constructor(entity: TicketDebitEntity, id?: string) {
    Object.assign(this, entity);
    this.id = id || generateId();
  }
}
