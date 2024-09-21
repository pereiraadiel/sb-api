import { TicketDebitEntity } from '@/domain/entities/ticketDebit.entity';

export type CreateTicketDebitDto = Omit<
  TicketDebitEntity,
  'id' | 'createdAt' | 'activeTicket' | 'centsAmount'
> & {
  quantity?: number;
  centsAmount?: number;
};

export type TicketDebitFiltersDto = {
  activeTicketId: string;
  createdAt: {
    greaterThan: Date;
  };
};
