import { SaleStandGoodEntity } from '@/domain/entities/saleStandGood.entity';

export type CreateSaleStandGoodDto = Omit<
  SaleStandGoodEntity,
  'id' | 'createdAt' | 'good' | 'saleStand'
>;

export type UpdateSaleStandGoodDto = Partial<Omit<CreateSaleStandGoodDto, 'saleStandId' | 'goodId'>> & {id: string}

export type AssociateGoodToSaleStandDto = {
  goodId: string;
  saleStandId: string;
  priceCents: number;
  stock: number;
};
