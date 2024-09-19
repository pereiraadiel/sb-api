import { generateId } from '@/domain/utils/generators.util';
import { SaleStandGoodEntity } from './saleStandGood.entity';

export class GoodEntity {
  id!: string;
  category!: string;
  fullname!: string;
  description!: string;
  priceCents!: number;
  createdAt!: Date;

  stands?: SaleStandGoodEntity[] = [];

  constructor(entity: GoodEntity, id?: string) {
    Object.assign(this, entity);
    this.id = id || generateId();
  }
}
