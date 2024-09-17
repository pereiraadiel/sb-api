import { TicketDebitEntity } from '@/domain/entities/ticketDebit.entity';

export type CreateTicketDebitDto = Omit<
  TicketDebitEntity,
  'id' | 'createdAt' | 'activeTicket'
>;

export type TicketDebitFiltersDto = {
  activeTicketId: string;
};
