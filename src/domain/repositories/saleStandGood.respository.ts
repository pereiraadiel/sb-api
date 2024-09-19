import { SaleStandGoodEntity } from '@/domain/entities/saleStandGood.entity';
import { CreateSaleStandGoodDto } from '@/domain/dtos/saleStandGood.dto';

export interface SaleStandGoodRepository {
  create(saleStandGood: CreateSaleStandGoodDto): Promise<SaleStandGoodEntity>;
  update(
    saleStandGood: CreateSaleStandGoodDto,
  ): Promise<SaleStandGoodEntity | null>;
  updateStock(id: string, stock: number): Promise<SaleStandGoodEntity | null>;
  findById(id: string): Promise<SaleStandGoodEntity | null>;
  findByCode(code: string): Promise<SaleStandGoodEntity | null>;
  findBySaleStandAndGood(
    saleStandId: string,
    goodId: string,
  ): Promise<SaleStandGoodEntity | null>;
}
