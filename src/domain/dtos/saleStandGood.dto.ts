import { SaleStandGoodEntity } from '@/domain/entities/saleStandGood.entity';

export type CreateSaleStandGoodDto = Omit<
  SaleStandGoodEntity,
  'id' | 'createdAt' | 'good' | 'saleStand'
>;
