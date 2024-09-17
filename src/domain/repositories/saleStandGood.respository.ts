import { SaleStandGoodEntity } from '@/domain/entities/saleStandGood.entity';
import { CreateSaleStandGoodDto } from '@/domain/dtos/saleStandGood.dto';

export interface SaleStandGoodRepository {
  create(saleStandGood: CreateSaleStandGoodDto): Promise<SaleStandGoodEntity>;
  findById(id: string): Promise<SaleStandGoodEntity | null>;
  findByCode(code: string): Promise<SaleStandGoodEntity | null>;
}
