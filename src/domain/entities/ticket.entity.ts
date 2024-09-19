import { generateId } from "@/domain/utils/generators.util";
import { ActiveTicketEntity } from "./activeTicket.entity";

export class TicketEntity {
  id!: string;
  physicalCode!: string;

  activeTickets?: ActiveTicketEntity[] = [];

  constructor(entity: TicketEntity, id?: string) {
    Object.assign(this, entity);
    this.id = id || generateId()
  }
}
