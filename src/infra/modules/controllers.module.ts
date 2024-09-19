import { Module } from "@nestjs/common";

import { UsecasesModule } from "./usecases.module";
import { StandsController } from "@/infra/controllers/stands.controller";
import { TicketsController } from "@/infra/controllers/tickets.controller";
import { GoodsController } from "@/infra/controllers/goods.controller";

const controllers = [
	TicketsController,
	StandsController,
	GoodsController
]

@Module({
	imports: [UsecasesModule],
	controllers: controllers,
})
export class ControllersModule {}