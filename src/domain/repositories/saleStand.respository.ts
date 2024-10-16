import { SaleStandEntity } from '@/domain/entities/saleStand.entity';
import { CreateSaleStandDto } from '@/domain/dtos/saleStand.dto';

export const SALE_STAND_REPOSITORY = 'SALE_STAND_REPOSITORY';

export interface SaleStandRepository {
  create(saleStand: CreateSaleStandDto): Promise<SaleStandEntity>;
  findById(id: string): Promise<SaleStandEntity | null>;
  findByCode(code: string): Promise<SaleStandEntity | null>;
  findMany(): Promise<SaleStandEntity[]>;
}
