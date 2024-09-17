import { SaleStandGoodEntity } from '@/domain/entities/saleStandGood.entity';
import { goodToResponseMapper } from './goodToResponse.mapper';

export function saleStandGoodToResponseMapper(
  saleStandGood: SaleStandGoodEntity,
) {
  return {
    id: saleStandGood.id,
    priceCents: saleStandGood.priceCents,
    good: goodToResponseMapper(saleStandGood.good),
    stock: saleStandGood.stock,
    createdAt: saleStandGood.createdAt,
  };
}
