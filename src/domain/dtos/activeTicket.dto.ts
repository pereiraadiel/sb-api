import { ActiveTicketEntity } from '@/domain/entities/activeTicket.entity';

export type ActiveTicketFiltersDto = {
  ticketId?: string;
  ticketPhysicalCode?: string;
  activeUntil?: {
    greaterThan: Date;
  };
};

export type CreateActiveTicketDto = Omit<
  ActiveTicketEntity,
  'id' | 'createdAt' | 'ticket'
>;
