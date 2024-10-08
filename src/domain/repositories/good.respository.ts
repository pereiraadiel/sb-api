import { GoodEntity } from '@/domain/entities/good.entity';
import { CreateGoodDto } from '@/domain/dtos/good.dto';

export const GOOD_REPOSITORY = 'GOOD_REPOSITORY';
export interface GoodRepository {
  create(good: CreateGoodDto): Promise<GoodEntity>;
  findById(id: string): Promise<GoodEntity | null>;
}
