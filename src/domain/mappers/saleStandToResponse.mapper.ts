import { SaleStandEntity } from '@/domain/entities/saleStand.entity';
import { goodToResponseMapper } from './goodToResponse.mapper';

export function saleStandToResponseMapper(saleStand: SaleStandEntity) {
  return {
    id: saleStand.id,
    fullname: saleStand.fullname,
    category: saleStand.category,
    goods: saleStand.goods.map(({ good, priceCents, stock }) => {
      return { ...goodToResponseMapper(good), priceCents, stock };
    }),
    createdAt: saleStand.createdAt,
  };
}
