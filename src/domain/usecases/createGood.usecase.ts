import { GoodRepository } from '@/domain/repositories/good.respository';
import { CreateGoodDto } from '@/domain/dtos/good.dto';
import { goodToResponseMapper } from '@/domain/mappers/goodToResponse.mapper';

export class CreateGoodUsecase {
  constructor(private readonly goodRepository: GoodRepository) {}

  async execute(good: CreateGoodDto) {
    try {
      const newGood = await this.goodRepository.create(good);
      return goodToResponseMapper(newGood);
    } catch (error) {
      console.error('CreateGoodUsecase: ', error);
      throw new Error(error.message);
    }
  }
}
