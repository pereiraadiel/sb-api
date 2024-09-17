import { SaleStandGoodEntity } from './saleStandGood.entity';

export class SaleStandEntity {
  id!: string;
  category!: string;
  fullname!: string;
  code!: string;
  createdAt!: Date;

  goods: SaleStandGoodEntity[] = [];

  constructor(entity: SaleStandEntity) {
    Object.assign(this, entity);
  }
}
