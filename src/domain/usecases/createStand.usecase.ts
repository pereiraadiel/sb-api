import { SaleStandRepository } from '@/domain/repositories/saleStand.respository';
import { CreateSaleStandDto } from '@/domain/dtos/saleStand.dto';
import { generateCode } from '@/domain/utils/generators.util';
import { saleStandToResponseMapper } from '@/domain/mappers/saleStandToResponse.mapper';

export class CreateSaleStandUsecase {
  constructor(private readonly saleSaleStandRepository: SaleStandRepository) {}

  async execute(saleSaleStand: Omit<CreateSaleStandDto, 'code'>) {
    try {
      const newSaleStand = await this.saleSaleStandRepository.create({
        ...saleSaleStand,
        code: generateCode(),
      });
      return saleStandToResponseMapper(newSaleStand);
    } catch (error) {
      console.error('CreateSaleStandUsecase: ', error);
      throw new Error(error.message);
    }
  }
}
