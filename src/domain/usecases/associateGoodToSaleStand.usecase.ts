import { AssociateGoodToSaleStandDto } from '@/domain/dtos/saleStandGood.dto';
import { GOOD_REPOSITORY, GoodRepository } from '@/domain/repositories/good.respository';
import { SALE_STAND_REPOSITORY, SaleStandRepository } from '@/domain/repositories/saleStand.respository';
import { SALE_STAND_GOOD_REPOSITORY, SaleStandGoodRepository } from '@/domain/repositories/saleStandGood.respository';
import { saleStandGoodToResponseMapper } from '@/domain/mappers/saleStandGoodToResponse.mapper';
import { Inject, Injectable } from '@nestjs/common';

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
        throw new Error('Good not found');
      }

      if (!saleStand) {
        throw new Error('Sale stand not found');
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
      console.error('AssociateGoodToSaleStand: ', error);
      throw new Error(error.message);
    }
  }
}
