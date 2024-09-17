import { TicketCreditEntity } from '@/domain/entities/ticketCredit.entity';

export type CreateTicketCreditDto = Omit<
  TicketCreditEntity,
  'id' | 'createdAt' | 'activeTicket'
>;

export type TicketCreditFiltersDto = {
  activeTicketId: string;
  expiresIn: {
    greaterThan: Date;
  };
};
