import { GetActiveTicketBalanceUsecase } from '@/domain/usecases/getActiveTicketBalance.usecase';
import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
} from '@nestjs/common';

import { AuthenticateTicketUsecase } from '@/domain/usecases/authenticateTicket.usecase';
import { ActivateTicketUsecase } from '@/domain/usecases/activateTicket.usecase';
import { CreateTicketsUsecase } from '@/domain/usecases/createTickets.usecase';
import { CreditTicketUsecase } from '@/domain/usecases/creditTicket.usecase';
import { DebitTicketUsecase } from '@/domain/usecases/debitTicket.usecase';
import { GeneratePhysicalTicketsUsecase } from '@/domain/usecases/generatePhysicalTickets.usecase';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly createTicketsUsecase: CreateTicketsUsecase,
    private readonly activateTicketUsecase: ActivateTicketUsecase,
    private readonly authenticateTicketUsecase: AuthenticateTicketUsecase,
    private readonly creditTicketUsecase: CreditTicketUsecase,
    private readonly debitTicketUsecase: DebitTicketUsecase,
    private readonly getActiveTicketBalanceUsecase: GetActiveTicketBalanceUsecase,
    private readonly generatePhysicalTickets: GeneratePhysicalTicketsUsecase,
  ) {}

  @Post()
  async createTickets(@Req() req: Request) {
    const { body } = req;
    const { quantity } = body as any;
    return await this.createTicketsUsecase.execute(quantity);
  }

  @Get('physical')
  async getPhysicalTickets(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.generatePhysicalTickets.execute();
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="bilhetes.pdf"`,
    });

    const pdf = fs.createReadStream(
      path.resolve(__dirname, '..', '..', 'assets', 'tickets.pdf'),
    );

    return new StreamableFile(pdf);
  }

  @Post(':code/activate')
  async activateTicket(@Req() req: Request, @Param() param: any) {
    const { code } = param;
    const { body } = req;
    const { phoneNumber } = body as any;

    return await this.activateTicketUsecase.execute(code, phoneNumber);
  }

  @Post(':code/authenticate')
  async authenticateTicket(@Req() req: Request, @Param() param: any) {
    const { code } = param;
    const { body } = req;
    const { emoji } = body as any;

    return await this.authenticateTicketUsecase.execute(code, emoji);
  }

  @Post(':code/credit')
  async creditTicket(@Req() req: Request, @Param() param: any) {
    const { code } = param;
    const { body } = req;
    const { centsAmount } = body as any;

    return await this.creditTicketUsecase.execute({
      centsAmount,
      physicalCode: code,
    });
  }

  @Post(':ticketId/debit')
  async debitTicket(@Req() req: Request, @Param() param: any) {
    const { ticketId } = param;
    const { body } = req;
    const { goods } = body as any;

    return await this.debitTicketUsecase.execute(
      goods.map((good) => ({
        activeTicketId: ticketId,
        centsAmount: good.centsAmount,
        saleStandGoodId: good.id,
        quantity: good.quantity,
      })),
    );
  }

  @Get(':code/balance')
  async getTicketBalance(@Req() req: Request, @Param() param: any) {
    const { code } = param;

    return await this.getActiveTicketBalanceUsecase.execute(code);
  }
}
