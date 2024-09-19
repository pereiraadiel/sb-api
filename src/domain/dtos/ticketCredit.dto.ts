import { TicketCreditEntity } from '@/domain/entities/ticketCredit.entity';

export type CreateTicketCreditDto = Omit<
  TicketCreditEntity,
  'id' | 'createdAt' | 'activeTicket' | 'expiresIn'
> & {expiresIn?: Date}

export type TicketCreditFiltersDto = {
  activeTicketId: string;
  expiresIn: {
    greaterThan: Date;
  };
};
