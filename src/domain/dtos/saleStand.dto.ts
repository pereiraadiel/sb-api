import { SaleStandEntity } from '@/domain/entities/saleStand.entity';

export type CreateSaleStandDto = Omit<
  SaleStandEntity,
  'id' | 'createdAt' | 'goods'
>;
