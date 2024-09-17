export class TicketEntity {
  id!: string;
  physicalCode!: string;

  constructor(entity: TicketEntity) {
    Object.assign(this, entity);
  }
}
