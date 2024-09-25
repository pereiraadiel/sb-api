import { Inject, Injectable } from '@nestjs/common';

import { CreateTicketDebitDto } from '@/domain/dtos/ticketDebit.dto';
import {
  TICKET_DEBIT_REPOSITORY,
  TicketDebitRepository,
} from '@/domain/repositories/ticketDebit.respository';
import {
  ACTIVE_TICKET_REPOSITORY,
  ActiveTicketRepository,
} from '@/domain/repositories/activeTicket.repository';
import {
  SALE_STAND_GOOD_REPOSITORY,
  SaleStandGoodRepository,
} from '@/domain/repositories/saleStandGood.respository';
import {
  TRANSACTIONAL_REPOSITORY,
  TransactionalRepository,
} from '@/domain/repositories/transactional.repository';
import {
  TICKET_CREDIT_REPOSITORY,
  TicketCreditRepository,
} from '@/domain/repositories/ticketCredit.respository';
import { BadRequestError } from '@/domain/errors/badRequest.error';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class DebitTicketUsecase {
  constructor(
    @Inject(ACTIVE_TICKET_REPOSITORY)
    private readonly activeTicketRepository: ActiveTicketRepository,
    @Inject(TICKET_DEBIT_REPOSITORY)
    private readonly ticketDebitRepository: TicketDebitRepository,
    @Inject(TICKET_CREDIT_REPOSITORY)
    private readonly ticketCreditRepository: TicketCreditRepository,
    @Inject(SALE_STAND_GOOD_REPOSITORY)
    private readonly saleStandGoodRepository: SaleStandGoodRepository,
    @Inject(TRANSACTIONAL_REPOSITORY)
    private readonly transactionRepository: TransactionalRepository,
  ) {}
  async execute(debitations: CreateTicketDebitDto[]) {
    try {
      const [ticket] = debitations;
      const goodIds = debitations.map((ticket) => ticket.saleStandGoodId);

      const [activeTickets, saleStandGoods] = await Promise.all([
        this.activeTicketRepository.findMany({
          ticketId: ticket.activeTicketId,
          activeUntil: {
            greaterThan: new Date(),
          },
        }),
        this.saleStandGoodRepository.findManyByIds(goodIds),
      ]);

      if (saleStandGoods.length < debitations.length) {
        throw new BadRequestError(
          'Ao menos um item de sua compra não foi encontrado',
          'DebitTicketUsecase',
        );
      }

      if (!activeTickets.length) {
        throw new BadRequestError('Bilhete não ativado', 'DebitTicketUsecase');
      }

      const [activeTicket] = activeTickets;

      const activeTicketCredits = activeTicket.credits.filter(
        (credit) => credit.expiresIn > new Date(),
      );

      if (activeTicketCredits.length === 0) {
      }

      // menor data de criação de um credito ativo
      const earliestCreditDate = activeTicketCredits.reduce(
        (acc, ticketCredit) =>
          ticketCredit.createdAt < acc ? ticketCredit.createdAt : acc,
        activeTicketCredits[0].createdAt,
      );

      const activeTicketDebits = activeTicket.debits.filter(
        (debit) => debit.createdAt > earliestCreditDate,
      );

      const activeTicketCentsAmount = activeTicketCredits.reduce(
        (acc, credit) => acc + credit.centsAmount,
        0,
      );

      const currentDebitsTotalCentsAmount = activeTicketDebits.reduce(
        (acc, ticket) => acc + ticket.centsAmount,
        0,
      );

      const debitTotalCentsAmount = debitations.reduce((acc, ticket) => {
        const saleStandGood = saleStandGoods.find(
          (item) => item.id === ticket.saleStandGoodId,
        );
        return acc + saleStandGood.priceCents * ticket.quantity;
      }, 0);

      if (
        activeTicketCentsAmount <
        debitTotalCentsAmount + currentDebitsTotalCentsAmount
      ) {
        throw new BadRequestError('Saldo insuficiente', 'DebitTicketUsecase');
      }

      for (const ticket of debitations) {
        const saleStandGood = saleStandGoods.find(
          (good) => good.id === ticket.saleStandGoodId,
        );

        if (saleStandGood.stock < ticket.quantity) {
          throw new BadRequestError(
            `Quantidade insuficiente em estoque para ${saleStandGood.good.fullname}`,
            'DebitTicketUsecase',
          );
        }
      }

      // criar uma transação para cada débito/quantidade ou seja se um produto for debitado 3 vezes, 3 transações serão criadas
      const debitationsDuplications: CreateTicketDebitDto[] = [];
      debitations.forEach((ticket) => {
        for (let i = 1; i <= ticket.quantity; i++) {
          debitationsDuplications.push({
            ...ticket,
            quantity: 1,
          });
        }
      });

      const [] = await Promise.all([
        // await this.transactionRepository.beginTransaction([
        this.ticketDebitRepository.createMany(
          debitationsDuplications.map((ticket) => {
            const saleStandGood = saleStandGoods.find(
              (item) => item.id === ticket.saleStandGoodId,
            );
            return {
              centsAmount: saleStandGood.priceCents,
              saleStandGoodId: ticket.saleStandGoodId,
              activeTicketId: activeTicket.id,
            };
          }),
        ),
        ...debitations.map((debitation) => {
          const saleStandGood = saleStandGoods.find(
            (item) => item.id === debitation.saleStandGoodId,
          );
          return this.saleStandGoodRepository.updateStock(
            saleStandGood.id,
            saleStandGood.stock - debitation.quantity,
          );
        }),
      ]);
      // ]);

      return {
        debitation: debitTotalCentsAmount,
      };
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      throw new GenericError(
        'Erro ao debitar bilhete',
        'DebitTicketUsecase',
      ).addCompleteError(error);
    }
  }
}
