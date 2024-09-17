import { ActiveTicketEntity } from './activeTicket.entity';

export class TicketDebitEntity {
  id!: string;
  activeTicketId!: string;
  centsAmount!: number;
  saleStandGoodId!: string;
  createdAt!: Date;

  activeTicket: ActiveTicketEntity;

  constructor(entity: TicketDebitEntity) {
    Object.assign(this, entity);
  }
}
