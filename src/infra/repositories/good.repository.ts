import { Injectable } from '@nestjs/common';

import { generateId } from '@/domain/utils/generators.util';
import { CreateGoodDto } from '@/domain/dtos/good.dto';
import { GoodEntity } from '@/domain/entities/good.entity';
import { GoodRepository } from '@/domain/repositories/good.respository';
import { PrismaProvider } from '@/infra/database/prisma.provider';

@Injectable()
export class ConcreteGoodRepository implements GoodRepository {
  constructor(private readonly prisma: PrismaProvider) {}

  async create(good: CreateGoodDto): Promise<GoodEntity> {
    try {
      const createdGood = await this.prisma.good.create({
        data: {
          fullname: good.fullname,
          category: good.category,
          description: good.description,
          priceCents: good.priceCents,
          id: generateId(),
        },
      });

      return new GoodEntity(createdGood);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<GoodEntity> {
    try {
			const good = await this.prisma.good.findUnique({
				where: {
					id,
				},
			});

			return new GoodEntity(good);
		} catch (error) {
			throw error;
		}
  }
}
