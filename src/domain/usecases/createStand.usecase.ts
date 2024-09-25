import { Inject, Injectable } from '@nestjs/common';

import {
  SALE_STAND_REPOSITORY,
  SaleStandRepository,
} from '@/domain/repositories/saleStand.respository';
import { CreateSaleStandDto } from '@/domain/dtos/saleStand.dto';
import { saleStandToResponseMapper } from '@/domain/mappers/saleStandToResponse.mapper';
import { generateCode } from '@/domain/utils/generators.util';
import { EncodeUtil } from '@/domain/utils/encode.util';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class CreateSaleStandUsecase {
  constructor(
    @Inject(SALE_STAND_REPOSITORY)
    private readonly saleSaleStandRepository: SaleStandRepository,
  ) {}

  async execute(saleSaleStand: Omit<CreateSaleStandDto, 'code'>) {
    try {
      const code = generateCode();
      const encodedCode = EncodeUtil.encodeBase64(code);
      const newSaleStand = await this.saleSaleStandRepository.create({
        ...saleSaleStand,
        code: encodedCode,
      });
      return saleStandToResponseMapper(newSaleStand);
    } catch (error) {
      throw new GenericError(
        'Erro ao criar barraquinha',
        'CreateSaleStandUsecase',
      ).addCompleteError(error);
    }
  }
}
