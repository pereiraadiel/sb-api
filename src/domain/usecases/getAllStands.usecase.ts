import { Inject, Injectable } from '@nestjs/common';

import {
  SALE_STAND_REPOSITORY,
  SaleStandRepository,
} from '@/domain/repositories/saleStand.respository';
import { saleStandToResponseMapper } from '@/domain/mappers/saleStandToResponse.mapper';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class GetAllSaleStandsUsecase {
  constructor(
    @Inject(SALE_STAND_REPOSITORY)
    private readonly saleSaleStandRepository: SaleStandRepository,
  ) {}

  async execute() {
    try {
      const stands = await this.saleSaleStandRepository.findMany();
      return stands.map((stand) => saleStandToResponseMapper(stand));
    } catch (error) {
      throw new GenericError(
        'Erro ao obter barraquinhas',
        'GetAllSaleStandsUsecase',
      ).addCompleteError(error);
    }
  }
}
