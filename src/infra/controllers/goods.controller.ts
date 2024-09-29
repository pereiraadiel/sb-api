import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { CreateGoodUsecase } from '@/domain/usecases/createGood.usecase';
import { AdminAuthGuard } from '@/infra/guards/adminAuth.guard';

@Controller('goods')
export class GoodsController {
  constructor(private readonly createGoodUsecase: CreateGoodUsecase) {}

  @Post()
  @Throttle({ default: { limit: 3, ttl: 1 * 60 * 1000 } })
  @UseGuards(AdminAuthGuard)
  async createGoods(@Req() req: Request) {
    const { body } = req;
    const { category, fullname, description, priceCents } = body as any;
    return await this.createGoodUsecase.execute({
      category,
      fullname,
      description,
      priceCents,
    });
  }
}
