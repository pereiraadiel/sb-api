import { Controller, Param, Post, Req } from "@nestjs/common";

import { CreateTicketsUsecase } from "@/domain/usecases/createTickets.usecase";
import { ActivateTicketUsecase } from "../../domain/usecases/activateTicket.usecase";

@Controller('tickets')
export class TicketsController {
	constructor(
		private readonly createTicketsUsecase: CreateTicketsUsecase,
		private readonly activateTicketUsecase: ActivateTicketUsecase,
	) {}

	@Post()
	async createTickets(@Req() req: Request) {
		const { body } = req;
		const { quantity } = body as any;
		return await this.createTicketsUsecase.execute(quantity);
	}

	@Post(':code/activate')
	async activateTicket(@Req() req: Request, @Param() param: any) {
		const { code } = param;
		const { body } = req;
		const { phoneNumber } = body as any;
		
		return await this.activateTicketUsecase.execute(code, phoneNumber);
	}
}