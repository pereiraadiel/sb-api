import { Module } from '@nestjs/common';

import { ConcreteActiveTicketRepository } from '@/infra/repositories/activeTicket.repository';
import { ACTIVE_TICKET_REPOSITORY } from '@/domain/repositories/activeTicket.repository';
import { GOOD_REPOSITORY } from '@/domain/repositories/good.respository';
import { ConcreteGoodRepository } from '@/infra/repositories/good.repository';
import { SALE_STAND_REPOSITORY } from '@/domain/repositories/saleStand.respository';
import { ConcreteSaleStandRepository } from '@/infra/repositories/saleStand.repository';
import { SALE_STAND_GOOD_REPOSITORY } from '@/domain/repositories/saleStandGood.respository';
import { ConcreteSaleStandGoodRepository } from '@/infra/repositories/saleStandGood.repository';
import { TICKET_REPOSITORY } from '@/domain/repositories/ticket.respository';
import { ConcreteTicketRepository } from '@/infra/repositories/ticket.repository';
import { TICKET_DEBIT_REPOSITORY } from '@/domain/repositories/ticketDebit.respository';
import { ConcreteTicketDebitRepository } from '@/infra/repositories/ticketDebit.repository';
import { TICKET_CREDIT_REPOSITORY } from '@/domain/repositories/ticketCredit.respository';
import { TRANSACTIONAL_REPOSITORY } from '@/domain/repositories/transactional.repository';
import { ConcreteTicketCreditRepository } from '@/infra/repositories/ticketCredit.repository';
import { ConcreteTransactionalRepository } from '@/infra/repositories/transactional.repository';

import { DatabaseModule } from './database.module';

const repositories = [
  {
    provide: ACTIVE_TICKET_REPOSITORY,
    useClass: ConcreteActiveTicketRepository,
  },
  {
    provide: GOOD_REPOSITORY,
    useClass: ConcreteGoodRepository,
  },
  {
    provide: SALE_STAND_REPOSITORY,
    useClass: ConcreteSaleStandRepository,
  },
  {
    provide: SALE_STAND_GOOD_REPOSITORY,
    useClass: ConcreteSaleStandGoodRepository,
  },
  {
    provide: TICKET_REPOSITORY,
    useClass: ConcreteTicketRepository,
  },
  {
    provide: TICKET_DEBIT_REPOSITORY,
    useClass: ConcreteTicketDebitRepository,
  },
  {
    provide: TICKET_CREDIT_REPOSITORY,
    useClass: ConcreteTicketCreditRepository,
  },
  {
    provide: TRANSACTIONAL_REPOSITORY,
    useClass: ConcreteTransactionalRepository,
  },
];

@Module({
  imports: [DatabaseModule],
  providers: repositories,
  exports: repositories,
})
export class RepositoriesModule {}
