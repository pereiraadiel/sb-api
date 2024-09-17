import { TicketEntity } from './ticket.entity';

export class ActiveTicketEntity {
  id!: string;
  ticketId!: string;
  phoneNumber!: string;
  emoji!: string;
  activeUntil!: Date;
  createdAt!: Date;

  ticket!: TicketEntity;

  constructor(entity: ActiveTicketEntity) {
    Object.assign(this, entity);
  }
}
