import { Injectable } from '@nestjs/common';

import { generateId } from '@/domain/utils/generators.util';
import { SaleStandGoodRepository } from '@/domain/repositories/saleStandGood.respository';
import { CreateSaleStandGoodDto, UpdateSaleStandGoodDto } from '@/domain/dtos/saleStandGood.dto';
import { SaleStandGoodEntity } from '@/domain/entities/saleStandGood.entity';
import { PrismaProvider } from '@/infra/database/prisma.provider';

@Injectable()
export class ConcreteSaleStandGoodRepository
  implements SaleStandGoodRepository
{
  constructor(private readonly prisma: PrismaProvider) {}

  async create(
    saleStandGood: CreateSaleStandGoodDto,
  ): Promise<SaleStandGoodEntity> {
    try {
      const createdSaleStandGood = await this.prisma.saleStandGood.create({
        data: {
          id: generateId(),
          stock: saleStandGood.stock,
					priceCents: saleStandGood.priceCents,
					saleStand: {
						connect: {
							id: saleStandGood.saleStandId,
						},
					},
					good: {
						connect: {
							id: saleStandGood.goodId,
						},
					},
        },
				include: {
					saleStand: true,
					good: true,
					sales: true
				}
      });

      return new SaleStandGoodEntity(createdSaleStandGood);
    } catch (error) {
      throw error;
    }
  }

  async update(
    saleStandGood: UpdateSaleStandGoodDto,
  ): Promise<SaleStandGoodEntity> {
    try {
			const updatedSaleStandGood = await this.prisma.saleStandGood.update({
				where: {
					id: saleStandGood.id,
				},
				data: {
					priceCents: saleStandGood.priceCents,
				},
				include: {
					saleStand: true,
					good: true,
					sales: true
				}
			});

			return new SaleStandGoodEntity(updatedSaleStandGood);
    } catch (error) {
      throw error;
    }
  }

  async updateStock(id: string, stock: number): Promise<SaleStandGoodEntity> {
    try {
			const updatedSaleStandGood = await this.prisma.saleStandGood.update({
				where: {
					id,
				},
				data: {
					stock,
				},
				include: {
					saleStand: true,
					good: true,
					sales: true
				}
			});

			return new SaleStandGoodEntity(updatedSaleStandGood);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<SaleStandGoodEntity> {
    try {
			const saleStandGood = await this.prisma.saleStandGood.findUnique({
				where: {
					id,
				},
				include: {
					saleStand: true,
					good: true,
					sales: true
				}
			});

			return new SaleStandGoodEntity(saleStandGood);
    } catch (error) {
      throw error;
    }
  }

  async findByCode(code: string): Promise<SaleStandGoodEntity> {
    try {
			const saleStandGood = await this.prisma.saleStandGood.findUnique({
				where: {
					id: code,
				},
				include: {
					saleStand: true,
					good: true,
					sales: true
				}
			});

			return new SaleStandGoodEntity(saleStandGood);
    } catch (error) {
      throw error;
    }
  }

  async findBySaleStandAndGood(
    saleStandId: string,
    goodId: string,
  ): Promise<SaleStandGoodEntity> {
    try {
			const saleStandGood = await this.prisma.saleStandGood.findFirst({
				where: {
					saleStandId,
					goodId,
				},
				include: {
					saleStand: true,
					good: true,
					sales: true
				}
			});

			return new SaleStandGoodEntity(saleStandGood);
    } catch (error) {
			throw error;
		}
  }
}
