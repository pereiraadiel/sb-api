import { Inject, Injectable } from '@nestjs/common';
import { GenericError } from '@/domain/errors/generic.error';
import { UnauthorizedError } from '@/domain/errors/unauthorized.error';
import { CACHE_SERVICE, CacheService } from '@/domain/services/cache.service';
import {
  generateObscureNumber,
  generateToken,
} from '@/domain/utils/generators.util';

@Injectable()
export class AuthenticateAdminUsecase {
  constructor(
    @Inject(CACHE_SERVICE)
    private readonly cacheService: CacheService,
  ) {}

  async execute(code: number) {
    try {
      const currentCode = generateObscureNumber();

      if (code !== currentCode) {
        throw new UnauthorizedError(
          'Código inválido',
          'AuthenticateAdminUsecase',
        );
      }

      // generate random token, store it in cache for 15 minutes and return it
      const token = generateToken(64);

      await this.cacheService.set(token, 'admin', 15 * 60);

      return { token };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new GenericError(
        'Erro inesperado',
        'AuthenticateAdminUsecase',
        error,
      );
    }
  }
}
