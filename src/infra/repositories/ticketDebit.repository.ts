import { Injectable } from '@nestjs/common';

import {
  CreateTicketDebitDto,
  TicketDebitFiltersDto,
} from '@/domain/dtos/ticketDebit.dto';
import { TicketDebitEntity } from '@/domain/entities/ticketDebit.entity';
import { TicketDebitRepository } from '@/domain/repositories/ticketDebit.respository';
import { generateId } from '@/domain/utils/generators.util';
import { PrismaProvider } from '@/infra/database/prisma.provider';

@Injectable()
export class ConcreteTicketDebitRepository implements TicketDebitRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async createMany(debitations: CreateTicketDebitDto[]): Promise<void> {
    try {
      await this.prisma.ticketDebit.createMany({
        data: debitations.map((ticketDebit) => ({
          centsAmount: ticketDebit.centsAmount,
          saleStandGoodId: ticketDebit.saleStandGoodId,
          id: generateId(),
          activeTicketId: ticketDebit.activeTicketId,
        })),
      });
    } catch (error) {
      throw error;
    }
  }

  async create(ticketDebit: CreateTicketDebitDto): Promise<TicketDebitEntity> {
    try {
      const createdTicketDebit = await this.prisma.ticketDebit.create({
        data: {
          centsAmount: ticketDebit.centsAmount,
          good: {
            connect: {
              id: ticketDebit.saleStandGoodId,
            },
          },
          id: generateId(),
          activeTicket: {
            connect: {
              id: ticketDebit.activeTicketId,
            },
          },
        },
        include: {
          activeTicket: true,
        },
      });

      if (!createdTicketDebit) return null;

      return new TicketDebitEntity(createdTicketDebit, createdTicketDebit.id);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<TicketDebitEntity> {
    try {
      const ticketDebitEntity = await this.prisma.ticketDebit.findUnique({
        where: {
          id,
        },
        include: {
          activeTicket: true,
        },
      });

      if (!ticketDebitEntity) return null;

      return new TicketDebitEntity(ticketDebitEntity, ticketDebitEntity.id);
    } catch (error) {
      throw error;
    }
  }

  async findMany(filters: TicketDebitFiltersDto): Promise<TicketDebitEntity[]> {
    try {
      const ticketDebits = await this.prisma.ticketDebit.findMany({
        where: {
          AND: {
            activeTicket: {
              id: filters.activeTicketId,
            },
            createdAt: {
              gte: filters.createdAt.greaterThan,
            },
          },
        },
        include: {
          activeTicket: true,
        },
      });

      return ticketDebits.map(
        (ticketDebit) => new TicketDebitEntity(ticketDebit, ticketDebit.id),
      );
    } catch (error) {
      throw error;
    }
  }
}
