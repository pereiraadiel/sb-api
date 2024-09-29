import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { UnauthorizedError } from '@/domain/errors/unauthorized.error';
import { VerifyAdminAuthenticationUsecase } from '@/domain/usecases/verifyAdminAuthentication.usecase';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly verifyAdminAuthenticationUsecase: VerifyAdminAuthenticationUsecase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      console.error('Token not found');
      throw new UnauthorizedError('Token não informado', 'AdminAuthGuard');
    }
    try {
      const isTokenValid = await this.verifyAdminAuthenticationUsecase.execute(
        token,
      );
      if (!isTokenValid) {
        console.error('Invalid token');
        throw new UnauthorizedError('Código inválido', 'AdminAuthGuard');
      }
    } catch {
      throw new UnauthorizedError(
        'Token inválido ou expirado',
        'AdminAuthGuard',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
