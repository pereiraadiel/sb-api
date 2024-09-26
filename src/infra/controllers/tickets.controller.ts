import { GetTicketEmojisToAuthenticateUsecase } from '@/domain/usecases/getTicketEmojisToAuthenticate.usecase';
import { GetTicketByCodeUsecase } from '@/domain/usecases/getTicketByCode.usecase';
import { GetActiveTicketBalanceUsecase } from '@/domain/usecases/getActiveTicketBalance.usecase';
import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { AuthenticateTicketUsecase } from '@/domain/usecases/authenticateTicket.usecase';
import { ActivateTicketUsecase } from '@/domain/usecases/activateTicket.usecase';
import { CreateTicketsUsecase } from '@/domain/usecases/createTickets.usecase';
import { CreditTicketUsecase } from '@/domain/usecases/creditTicket.usecase';
import { DebitTicketUsecase } from '@/domain/usecases/debitTicket.usecase';
import { GeneratePhysicalTicketsUsecase } from '@/domain/usecases/generatePhysicalTickets.usecase';
import { Request, Response } from 'express';
import { TicketAuthGuard } from '@/infra/guards/ticketAuth.guard';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly createTicketsUsecase: CreateTicketsUsecase,
    private readonly activateTicketUsecase: ActivateTicketUsecase,
    private readonly authenticateTicketUsecase: AuthenticateTicketUsecase,
    private readonly creditTicketUsecase: CreditTicketUsecase,
    private readonly debitTicketUsecase: DebitTicketUsecase,
    private readonly getActiveTicketBalanceUsecase: GetActiveTicketBalanceUsecase,
    private readonly getTicketByCodeUsecase: GetTicketByCodeUsecase,
    private readonly getTicketEmojisToAuthenticateUsecase: GetTicketEmojisToAuthenticateUsecase,
    private readonly generatePhysicalTickets: GeneratePhysicalTicketsUsecase,
  ) {}

  @Post()
  async createTickets(@Req() req: Request) {
    const { body } = req;
    const { quantity } = body as any;
    return await this.createTicketsUsecase.execute(quantity);
  }

  @Get('physical')
  async getPhysicalTickets(@Res() res: Response) {
    const pdfStream = await this.generatePhysicalTickets.execute();
    const buffers = [];
    let pdfBuffer: Buffer = null;

    pdfStream.on('readable', () => {
      const chunk = pdfStream.read();
      if (chunk) {
        buffers.push(chunk);
      }
      pdfBuffer = Buffer.concat(buffers);
    });

    const freeMemory = () => {
      pdfStream.destroy();
      buffers.length = 0;
      global.gc && global.gc();
    };

    pdfStream.on('data', (chunk) => buffers.push(chunk));
    pdfStream.on('end', () => {
      pdfBuffer = Buffer.concat(buffers);
      freeMemory();
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="bilhetes.pdf"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Length': pdfBuffer.length,
      });
      res.end(pdfBuffer);
    });
  }

  @Post(':code/activate')
  async activateTicket(@Req() req: Request, @Param() param: any) {
    console.log('activateTicket');
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

  @UseGuards(TicketAuthGuard)
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

  @Get(':code')
  async getTicket(@Req() req: Request, @Param() param: any) {
    const { code } = param;
    const balance = await this.getActiveTicketBalanceUsecase.execute(code);
    const ticket = await this.getTicketByCodeUsecase.execute(code);

    return {
      ...ticket,
      ...balance,
    };
  }

  @Get(':code/emojis')
  async getTicketAuthEmojis(@Req() req: Request, @Param() param: any) {
    const { code } = param;

    const emojis = await this.getTicketEmojisToAuthenticateUsecase.execute(
      code,
    );
    const emojisArray = Array.from(emojis);

    // retornar emojis como array em ordem aleatoria
    return emojisArray.sort(() => Math.random() - 0.5);
  }

  @Get(':code/balance')
  async getTicketBalance(@Req() req: Request, @Param() param: any) {
    const { code } = param;

    return await this.getActiveTicketBalanceUsecase.execute(code);
  }
}
