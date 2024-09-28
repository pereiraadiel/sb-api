import { Module } from '@nestjs/common';

import { UsecasesModule } from './usecases.module';
import { StandsController } from '@/infra/controllers/stands.controller';
import { TicketsController } from '@/infra/controllers/tickets.controller';
import { GoodsController } from '@/infra/controllers/goods.controller';
import { AuthController } from '@/infra/controllers/auth.controller';

const controllers = [
  TicketsController,
  StandsController,
  GoodsController,
  AuthController,
];

@Module({
  imports: [UsecasesModule],
  controllers: controllers,
})
export class ControllersModule {}
