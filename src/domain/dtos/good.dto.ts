import { GoodEntity } from '@/domain/entities/good.entity';

export type CreateGoodDto = Omit<GoodEntity, 'id' | 'createdAt'>;
