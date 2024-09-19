import { Injectable } from '@nestjs/common';

import {
  CreateTicketCreditDto,
  TicketCreditFiltersDto,
} from '@/domain/dtos/ticketCredit.dto';
import { TicketCreditEntity } from '@/domain/entities/ticketCredit.entity';
import { TicketCreditRepository } from '@/domain/repositories/ticketCredit.respository';
import { PrismaProvider } from '@/infra/database/prisma.provider';
import { generateId } from '../../domain/utils/generators.util';

@Injectable()
export class ConcreteTicketCreditRepository implements TicketCreditRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(
    ticketCredit: CreateTicketCreditDto,
  ): Promise<TicketCreditEntity> {
    try {
      const createdTicketCredit = await this.prisma.ticketCredit.create({
        data: {
          centsAmount: ticketCredit.centsAmount,
          expiresIn: ticketCredit.expiresIn,
          id: generateId(),
          activeTicket: {
            connect: {
              id: ticketCredit.activeTicketId,
            },
          },
        },
        include: {
          activeTicket: true,
        },
      });

      if (!createdTicketCredit) return null;

      return new TicketCreditEntity(createdTicketCredit, createdTicketCredit.id);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<TicketCreditEntity> {
    try {
      const ticketCreditEntity = await this.prisma.ticketCredit.findUnique({
        where: {
          id,
        },
        include: {
          activeTicket: true,
        },
      });

      if(!ticketCreditEntity) return null;

      return new TicketCreditEntity(ticketCreditEntity, ticketCreditEntity.id);
    } catch (error) {
      throw error;
    }
  }

  async findMany(
    filters: TicketCreditFiltersDto,
  ): Promise<TicketCreditEntity[]> {
    try {
      const ticketCredits = await this.prisma.ticketCredit.findMany({
        where: {
					AND: {
						activeTicket: {
							id: filters.activeTicketId
						},
						expiresIn: {
							gte: filters.expiresIn.greaterThan
						}
					}
				},
        include: {
          activeTicket: true,
        },
      });

      return ticketCredits.map(
        (ticketCredit) => new TicketCreditEntity(ticketCredit, ticketCredit.id),
      );
    } catch (error) {
      throw error;
    }
  }
}
