import { TicketCreditEntity } from '@/domain/entities/ticketCredit.entity';

export type CreateTicketCreditDto = Omit<
  TicketCreditEntity,
  'id' | 'createdAt' | 'activeTicket' | 'expiresIn' | 'activeTicketId'
> & { expiresIn?: Date; physicalCode: string; activeTicketId?: string };

export type TicketCreditFiltersDto = {
  physicalCode: string;
  expiresIn: {
    greaterThan: Date;
  };
};
