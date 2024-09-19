import { Injectable } from '@nestjs/common';

import { generateId } from '@/domain/utils/generators.util';
import { SaleStandRepository } from '@/domain/repositories/saleStand.respository';
import { CreateSaleStandDto } from '@/domain/dtos/saleStand.dto';
import { SaleStandEntity } from '@/domain/entities/saleStand.entity';
import { PrismaProvider } from '@/infra/database/prisma.provider';

@Injectable()
export class ConcreteSaleStandRepository implements SaleStandRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(saleStand: CreateSaleStandDto): Promise<SaleStandEntity> {
    try {
      const createdSaleStand = await this.prisma.saleStand.create({
				data: {
					code: saleStand.code,
					fullname: saleStand.fullname,
					category: saleStand.category,
					id: generateId(),
				}
			})

			return new SaleStandEntity(createdSaleStand);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<SaleStandEntity> {
    try {
			const saleStandEntity = await this.prisma.saleStand.findUnique({
				where: {
					id,
				},
			});

			return new SaleStandEntity(saleStandEntity);
    } catch (error) {
      throw error;
    }
  }

  async findByCode(code: string): Promise<SaleStandEntity> {
    try {
			const saleStandEntity = await this.prisma.saleStand.findUnique({
				where: {
					code
				},
			});

			return new SaleStandEntity(saleStandEntity);
    } catch (error) {
      throw error;
    }
  }
}
