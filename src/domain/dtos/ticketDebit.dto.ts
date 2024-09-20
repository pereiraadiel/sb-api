import { TicketDebitEntity } from '@/domain/entities/ticketDebit.entity';

export type CreateTicketDebitDto = Omit<
  TicketDebitEntity,
  'id' | 'createdAt' | 'activeTicket'
> & {
  quantity?: number;
};

export type TicketDebitFiltersDto = {
  activeTicketId: string;
  createdAt: {
    greaterThan: Date;
  };
};
