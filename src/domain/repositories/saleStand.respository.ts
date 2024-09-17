import { SaleStandEntity } from '@/domain/entities/saleStand.entity';
import { CreateSaleStandDto } from '@/domain/dtos/saleStand.dto';

export interface SaleStandRepository {
  create(saleStand: CreateSaleStandDto): Promise<SaleStandEntity>;
  findById(id: string): Promise<SaleStandEntity | null>;
  findByCode(code: string): Promise<SaleStandEntity | null>;
}
