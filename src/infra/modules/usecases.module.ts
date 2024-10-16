import { Module } from '@nestjs/common';

import { RepositoriesModule } from './repositories.module';
import { ServicesModule } from './services.module';

import { GetTicketByCodeUsecase } from '@/domain/usecases/getTicketByCode.usecase';
import { ActivateTicketUsecase } from '@/domain/usecases/activateTicket.usecase';
import { AssociateGoodToSaleStand } from '@/domain/usecases/associateGoodToSaleStand.usecase';
import { AuthenticateAdminUsecase } from '@/domain/usecases/authenticateAdmin.usecase';
import { AuthenticateSaleStand } from '@/domain/usecases/authenticateSaleStand.usecase';
import { AuthenticateTicketUsecase } from '@/domain/usecases/authenticateTicket.usecase';
import { CreateGoodUsecase } from '@/domain/usecases/createGood.usecase';
import { CreateSaleStandUsecase } from '@/domain/usecases/createStand.usecase';
import { GetAllSaleStandsUsecase } from '@/domain/usecases/getAllStands.usecase';
import { CreateTicketsUsecase } from '@/domain/usecases/createTickets.usecase';
import { CreditTicketUsecase } from '@/domain/usecases/creditTicket.usecase';
import { DebitTicketUsecase } from '@/domain/usecases/debitTicket.usecase';
import { GetActiveTicketBalanceUsecase } from '@/domain/usecases/getActiveTicketBalance.usecase';
import { GetTicketEmojisToAuthenticateUsecase } from '@/domain/usecases/getTicketEmojisToAuthenticate.usecase';
import { GeneratePhysicalTicketsUsecase } from '@/domain/usecases/generatePhysicalTickets.usecase';
import { VerifyTicketAuthenticationUsecase } from '@/domain/usecases/verifyTicketAuthentication.usecase';
import { VerifyAdminAuthenticationUsecase } from '@/domain/usecases/verifyAdminAuthentication.usecase';

const useCases = [
  ActivateTicketUsecase,
  AssociateGoodToSaleStand,
  AuthenticateSaleStand,
  AuthenticateTicketUsecase,
  AuthenticateAdminUsecase,
  CreateGoodUsecase,
  CreateSaleStandUsecase,
  GetAllSaleStandsUsecase,
  CreateTicketsUsecase,
  CreditTicketUsecase,
  DebitTicketUsecase,
  GetActiveTicketBalanceUsecase,
  GetTicketByCodeUsecase,
  GetTicketEmojisToAuthenticateUsecase,
  GeneratePhysicalTicketsUsecase,
  VerifyTicketAuthenticationUsecase,
  VerifyAdminAuthenticationUsecase,
];

@Module({
  imports: [RepositoriesModule, ServicesModule],
  providers: useCases,
  exports: useCases,
})
export class UsecasesModule {}
