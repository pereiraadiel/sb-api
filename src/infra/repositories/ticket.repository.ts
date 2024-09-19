import { Injectable } from '@nestjs/common';

import { generateId } from '@/domain/utils/generators.util';
import { CreateTicketDto } from '@/domain/dtos/ticket.dto';
import { TicketEntity } from '@/domain/entities/ticket.entity';
import { TicketRepository } from '@/domain/repositories/ticket.respository';
import { PrismaProvider } from '@/infra/database/prisma.provider';

@Injectable()
export class ConcreteTicketRepository implements TicketRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(ticket: CreateTicketDto): Promise<TicketEntity> {
    try {
      const ticketEntity = await this.prisma.ticket.create({
        data: {
          physicalCode: ticket.physicalCode,
          id: generateId(),
        },
      });

      if(!ticketEntity) return null;

      return new TicketEntity(ticketEntity, ticketEntity.id);
    } catch (error) {
      throw error;
    }
  }

  async findByCode(code: string): Promise<TicketEntity> {
    try {
      const ticketEntity = await this.prisma.ticket.findUnique({
        where: {
          physicalCode: code,
        },
      });

      if(!ticketEntity) return null;

      return new TicketEntity(ticketEntity, ticketEntity.id);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<TicketEntity> {
    try {
			const ticketEntity = await this.prisma.ticket.findUnique({
				where: {
					id,
				},
			});

      if(!ticketEntity) return null;

			return new TicketEntity(ticketEntity, ticketEntity.id);
    } catch (error) {
      throw error;
    }
  }
}
