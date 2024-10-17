import { generateId } from '@/domain/utils/generators.util';
import { SaleStandGoodEntity } from './saleStandGood.entity';

export class SaleStandEntity {
  id!: string;
  category!: string;
  fullname!: string;
  code!: string;
  createdAt!: Date;

  goods?: SaleStandGoodEntity[] = [];

  constructor(entity: SaleStandEntity, id?: string) {
    Object.assign(this, entity);
    this.id = id || generateId();
  }
}
