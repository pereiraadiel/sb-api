import { ActiveTicketEntity } from './activeTicket.entity';

export class TicketCreditEntity {
  id!: string;
  activeTicketId!: string;
  centsAmount!: number;
  expiresIn!: Date;
  createdAt!: Date;

  activeTicket!: ActiveTicketEntity;

  constructor(entity: TicketCreditEntity) {
    Object.assign(this, entity);
  }
}
