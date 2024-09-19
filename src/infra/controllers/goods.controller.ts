import { Controller, Post, Req } from '@nestjs/common';

import { CreateGoodUsecase } from '@/domain/usecases/createGood.usecase';

@Controller('goods')
export class GoodsController {
  constructor(private readonly createGoodUsecase: CreateGoodUsecase) {}

  @Post()
  async createGoods(@Req() req: Request) {
    const { body } = req;
    const { category, fullname, description, priceCents } = body as any;
    return await this.createGoodUsecase.execute({
      category,
      fullname,
      description,
      priceCents
    });
  }
}
