import { Inject, Injectable } from '@nestjs/common';

import { AssociateGoodToSaleStandDto } from '@/domain/dtos/saleStandGood.dto';
import {
  GOOD_REPOSITORY,
  GoodRepository,
} from '@/domain/repositories/good.respository';
import {
  SALE_STAND_REPOSITORY,
  SaleStandRepository,
} from '@/domain/repositories/saleStand.respository';
import {
  SALE_STAND_GOOD_REPOSITORY,
  SaleStandGoodRepository,
} from '@/domain/repositories/saleStandGood.respository';
import { saleStandGoodToResponseMapper } from '@/domain/mappers/saleStandGoodToResponse.mapper';
import { NotFoundError } from '@/domain/errors/notFound.error';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class AssociateGoodToSaleStand {
  constructor(
    @Inject(GOOD_REPOSITORY)
    private readonly goodRepository: GoodRepository,
    @Inject(SALE_STAND_REPOSITORY)
    private readonly saleStandRepository: SaleStandRepository,
    @Inject(SALE_STAND_GOOD_REPOSITORY)
    private readonly saleStandGoodRepository: SaleStandGoodRepository,
  ) {}

  async execute(dto: AssociateGoodToSaleStandDto) {
    try {
      const [good, saleStand] = await Promise.all([
        this.goodRepository.findById(dto.goodId),
        this.saleStandRepository.findById(dto.saleStandId),
      ]);

      if (!good) {
        throw new NotFoundError(
          'Produto não encontrado',
          'AssociateGoodToSaleStand',
        );
      }

      if (!saleStand) {
        throw new NotFoundError(
          'Barraquinha não encontrada',
          'AssociateGoodToSaleStand',
        );
      }

      const alreadyAssociated =
        await this.saleStandGoodRepository.findBySaleStandAndGood(
          dto.saleStandId,
          dto.goodId,
        );

      if (alreadyAssociated) {
        const saleStandGood = await this.saleStandGoodRepository.update({
          ...dto,
          id: alreadyAssociated.id,
          priceCents: dto.priceCents,
        });

        return saleStandGoodToResponseMapper(saleStandGood);
      }

      const saleStandGood = await this.saleStandGoodRepository.create({
        ...dto,
        priceCents: dto.priceCents,
      });

      return saleStandGoodToResponseMapper(saleStandGood);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new GenericError(
        'Erro ao associar produto à barraquinha',
        'AssociateGoodToSaleStand',
      ).addCompleteError(error);
    }
  }
}
