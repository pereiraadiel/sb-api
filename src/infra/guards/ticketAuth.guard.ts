import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { VerifyTicketAuthenticationUsecase } from '@/domain/usecases/verifyTicketAuthentication.usecase';

@Injectable()
export class TicketAuthGuard implements CanActivate {
  constructor(
    private readonly verifyTicketAuthenticationUsecase: VerifyTicketAuthenticationUsecase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.error('Token not found');
      throw new UnauthorizedException();
    }
    try {
      const ticket = await this.verifyTicketAuthenticationUsecase.execute(
        token,
      );

      if (ticket === false) {
        console.error('Ticket not found');
        throw new UnauthorizedException();
      }
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['ticketCode'] = ticket.physicalCode;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
