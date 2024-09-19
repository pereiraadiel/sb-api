import { generateId } from '@/domain/utils/generators.util';
import { GoodEntity } from './good.entity';
import { SaleStandEntity } from './saleStand.entity';
import { TicketDebitEntity } from './ticketDebit.entity';

export class SaleStandGoodEntity {
  id!: string;
  saleStandId!: string;
  goodId!: string;
  stock!: number;
  priceCents!: number;
  createdAt!: Date;

  good?: GoodEntity;
  saleStand?: SaleStandEntity;
  sales?: TicketDebitEntity[] = [];

  constructor(entity: SaleStandGoodEntity, id?: string) {
    Object.assign(this, entity);
    this.id = id || generateId()
  }
}
