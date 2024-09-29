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
import { Throttle } from '@nestjs/throttler';
import { Request, Response } from 'express';

import { AuthenticateTicketUsecase } from '@/domain/usecases/authenticateTicket.usecase';
import { ActivateTicketUsecase } from '@/domain/usecases/activateTicket.usecase';
import { CreateTicketsUsecase } from '@/domain/usecases/createTickets.usecase';
import { CreditTicketUsecase } from '@/domain/usecases/creditTicket.usecase';
import { DebitTicketUsecase } from '@/domain/usecases/debitTicket.usecase';
import { GeneratePhysicalTicketsUsecase } from '@/domain/usecases/generatePhysicalTickets.usecase';
import { TicketAuthGuard } from '@/infra/guards/ticketAuth.guard';
import { AdminAuthGuard } from '@/infra/guards/adminAuth.guard';

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
  @Throttle({ default: { limit: 1, ttl: 1 * 60 * 1000 } })
  @UseGuards(AdminAuthGuard)
  async createTickets(@Req() req: Request) {
    const { body } = req;
    const { quantity } = body as any;
    return await this.createTicketsUsecase.execute(quantity);
  }

  @Get('physical')
  @Throttle({ default: { limit: 1, ttl: 1 * 60 * 1000 } })
  @UseGuards(AdminAuthGuard)
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
  @Throttle({ default: { limit: 10, ttl: 1 * 60 * 1000 } })
  async activateTicket(@Req() req: Request, @Param() param: any) {
    console.log('activateTicket');
    const { code } = param;
    const { body } = req;
    const { phoneNumber } = body as any;

    return await this.activateTicketUsecase.execute(code, phoneNumber);
  }

  @Post(':code/authenticate')
  @Throttle({ default: { limit: 3, ttl: 1 * 60 * 1000 } })
  async authenticateTicket(@Req() req: Request, @Param() param: any) {
    const { code } = param;
    const { body } = req;
    const { emoji } = body as any;

    return await this.authenticateTicketUsecase.execute(code, emoji);
  }

  @Post(':code/credit')
  @Throttle({ default: { limit: 10, ttl: 1 * 60 * 1000 } })
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
  @Throttle({ default: { limit: 10, ttl: 1 * 60 * 1000 } })
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
  @Throttle({ default: { limit: 10, ttl: 1 * 60 * 1000 } })
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
  @Throttle({
    default: { limit: 3, ttl: 1 * 60 * 1000, blockDuration: 1 * 30 * 1000 },
  }) // 3 requests per minute with a block of 30 seconds
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
  @Throttle({ default: { limit: 10, ttl: 1 * 60 * 1000 } })
  async getTicketBalance(@Req() req: Request, @Param() param: any) {
    const { code } = param;

    return await this.getActiveTicketBalanceUsecase.execute(code);
  }
}
