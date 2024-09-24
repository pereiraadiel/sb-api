import { Controller, Param, Post, Req } from '@nestjs/common';

import { CreateSaleStandUsecase } from '@/domain/usecases/createStand.usecase';
import { AssociateGoodToSaleStand } from '@/domain/usecases/associateGoodToSaleStand.usecase';
import { AuthenticateSaleStand } from '@/domain/usecases/authenticateSaleStand.usecase';

@Controller('stands')
export class StandsController {
  constructor(
    private readonly createStandUsecase: CreateSaleStandUsecase,
    private readonly associateGoodToSaleStand: AssociateGoodToSaleStand,
    private readonly authenticateSaleStand: AuthenticateSaleStand,
  ) {}

  @Post()
  async createStands(@Req() req: Request) {
    const { body } = req;
    const { category, fullname } = body as any;
    return await this.createStandUsecase.execute({
      category,
      fullname,
    });
  }

  @Post(':id/goods')
  async associateGood(@Req() req: Request, @Param() params: any) {
    const { body } = req;
    const { goodId, priceCents, stock } = body as any;
    const { id } = params;

    return await this.associateGoodToSaleStand.execute({
      saleStandId: id,
      goodId,
      priceCents,
      stock,
    });
  }

  @Post('auth')
  async authenticate(@Req() req: Request) {
    const { body } = req;
    const { code } = body as any;
    return await this.authenticateSaleStand.execute(code);
  }
}
