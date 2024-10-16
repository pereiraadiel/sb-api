import { Injectable } from '@nestjs/common';
import {
  CreateActiveTicketDto,
  ActiveTicketFiltersDto,
} from '@/domain/dtos/activeTicket.dto';
import { ActiveTicketEntity } from '@/domain/entities/activeTicket.entity';
import { ActiveTicketRepository } from '@/domain/repositories/activeTicket.repository';
import { PrismaProvider } from '@/infra/database/prisma.provider';
import { generateId } from '@/domain/utils/generators.util';

@Injectable()
export class ConcreteActiveTicketRepository implements ActiveTicketRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(ticket: CreateActiveTicketDto): Promise<ActiveTicketEntity> {
    try {
      const activeTicket = await this.prisma.activeTicket.create({
        data: {
          activeUntil: ticket.activeUntil,
          emoji: ticket.emoji,
          phoneNumber: ticket.phoneNumber,
          ticket: {
            connect: {
              id: ticket.ticketId,
            },
          },
          id: generateId(),
        },
        include: {
          ticket: true,
          credits: true,
          debits: true,
        },
      });

      if (!activeTicket) return null;

      return new ActiveTicketEntity(activeTicket, activeTicket.id);
    } catch (error) {
      throw error;
    }
  }

  async findMany(
    filters: ActiveTicketFiltersDto,
  ): Promise<ActiveTicketEntity[]> {
    try {
      const activeTickets = await this.prisma.activeTicket.findMany({
        where: filters
          ? {
              ticket: {
                physicalCode: filters.ticketPhysicalCode,
              },
              activeUntil: {
                gte: filters.activeUntil.greaterThan,
              },
            }
          : undefined,
        include: {
          ticket: true,
          credits: true,
          debits: true,
        },
      });

      if (!activeTickets) return null;

      return activeTickets.map(
        (activeTicket) => new ActiveTicketEntity(activeTicket, activeTicket.id),
      );
    } catch (error) {
      throw error;
    }
  }

  async count(filters: ActiveTicketFiltersDto): Promise<number> {
    try {
      const activeTickets = await this.prisma.activeTicket.count({
        where: filters
          ? {
              ticket: {
                physicalCode: filters.ticketPhysicalCode,
              },
              activeUntil: {
                gte: filters.activeUntil.greaterThan,
              },
            }
          : undefined,
      });

      if (!activeTickets) return 0;

      return activeTickets;
    } catch (error) {
      throw error;
    }
  }
}
