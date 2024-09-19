import { SaleStandGoodEntity } from '@/domain/entities/saleStandGood.entity';
import { CreateSaleStandGoodDto, UpdateSaleStandGoodDto } from '@/domain/dtos/saleStandGood.dto';

export const SALE_STAND_GOOD_REPOSITORY = 'SALE_STAND_GOOD_REPOSITORY';

export interface SaleStandGoodRepository {
  create(saleStandGood: CreateSaleStandGoodDto): Promise<SaleStandGoodEntity>;
  update(
    saleStandGood: UpdateSaleStandGoodDto,
  ): Promise<SaleStandGoodEntity | null>;
  updateStock(id: string, stock: number): Promise<SaleStandGoodEntity | null>;
  findById(id: string): Promise<SaleStandGoodEntity | null>;
  findBySaleStandAndGood(
    saleStandId: string,
    goodId: string,
  ): Promise<SaleStandGoodEntity | null>;
}
