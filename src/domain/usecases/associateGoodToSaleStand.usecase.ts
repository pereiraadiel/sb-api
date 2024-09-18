import { AssociateGoodToSaleStandDto } from '@/domain/dtos/saleStandGood.dto';
import { GoodRepository } from '@/domain/repositories/good.respository';
import { SaleStandRepository } from '@/domain/repositories/saleStand.respository';
import { SaleStandGoodRepository } from '@/domain/repositories/saleStandGood.respository';
import { saleStandGoodToResponseMapper } from '@/domain/mappers/saleStandGoodToResponse.mapper';

export class AssociateGoodToSaleStand {
  constructor(
    private readonly goodRepository: GoodRepository,
    private readonly saleStandRepository: SaleStandRepository,
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
