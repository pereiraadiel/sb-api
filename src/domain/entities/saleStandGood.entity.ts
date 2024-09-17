import { GoodEntity } from './good.entity';
import { SaleStandEntity } from './saleStand.entity';

export class SaleStandGoodEntity {
  id!: string;
  saleStandId!: string;
  goodId!: string;
  stock!: number;
  priceCents!: number;
  createdAt!: Date;

  good!: GoodEntity;
  saleStand!: SaleStandEntity;

  constructor(entity: SaleStandGoodEntity) {
    Object.assign(this, entity);
  }
}
