import { Injectable } from '@nestjs/common';

import { generateId } from '@/domain/utils/generators.util';
import { SaleStandGoodRepository } from '@/domain/repositories/saleStandGood.respository';
import {
  CreateSaleStandGoodDto,
  UpdateSaleStandGoodDto,
} from '@/domain/dtos/saleStandGood.dto';
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
          sales: true,
        },
      });

      if (!createdSaleStandGood) return null;

      return new SaleStandGoodEntity(
        createdSaleStandGood,
        createdSaleStandGood.id,
      );
    } catch (error) {
      throw error;
    }
  }

  async update(
    saleStandGood: UpdateSaleStandGoodDto,
  ): Promise<SaleStandGoodEntity> {
    try {
      console.warn('saleStandGood', saleStandGood);
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
          sales: true,
        },
      });

      if (!updatedSaleStandGood) return null;

      return new SaleStandGoodEntity(
        updatedSaleStandGood,
        updatedSaleStandGood.id,
      );
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
          sales: true,
        },
      });

      if (!updatedSaleStandGood) return null;

      return new SaleStandGoodEntity(
        updatedSaleStandGood,
        updatedSaleStandGood.id,
      );
    } catch (error) {
      throw error;
    }
  }

  async findManyByIds(ids: string[]): Promise<SaleStandGoodEntity[]> {
    try {
      const saleStandGoods = await this.prisma.saleStandGood.findMany({
        where: {
          id: {
            in: ids,
          },
        },
        include: {
          saleStand: true,
          good: true,
          sales: true,
        },
      });

      return saleStandGoods.map(
        (saleStandGood) =>
          new SaleStandGoodEntity(saleStandGood, saleStandGood.id),
      );
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
          sales: true,
        },
      });

      if (!saleStandGood) return null;

      return new SaleStandGoodEntity(saleStandGood, saleStandGood.id);
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
          sales: true,
        },
      });

      if (!saleStandGood) return null;

      return new SaleStandGoodEntity(saleStandGood, saleStandGood.id);
    } catch (error) {
      throw error;
    }
  }
}
