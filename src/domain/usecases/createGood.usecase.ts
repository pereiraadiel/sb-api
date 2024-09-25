import {
  GOOD_REPOSITORY,
  GoodRepository,
} from '@/domain/repositories/good.respository';
import { CreateGoodDto } from '@/domain/dtos/good.dto';
import { goodToResponseMapper } from '@/domain/mappers/goodToResponse.mapper';
import { Inject, Injectable } from '@nestjs/common';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class CreateGoodUsecase {
  constructor(
    @Inject(GOOD_REPOSITORY)
    private readonly goodRepository: GoodRepository,
  ) {}

  async execute(good: CreateGoodDto) {
    try {
      const newGood = await this.goodRepository.create(good);
      return goodToResponseMapper(newGood);
    } catch (error) {
      throw new GenericError(
        'Erro ao criar produto',
        'CreateGoodUsecase',
      ).addCompleteError(error);
    }
  }
}
