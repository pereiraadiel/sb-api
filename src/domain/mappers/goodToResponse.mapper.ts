import { GoodEntity } from '@/domain/entities/good.entity';

export function goodToResponseMapper(good: GoodEntity) {
  return {
    id: good.id,
    category: good.category,
    fullname: good.fullname,
    description: good.description,
    priceCents: good.priceCents,
    createdAt: good.createdAt,
  };
}
