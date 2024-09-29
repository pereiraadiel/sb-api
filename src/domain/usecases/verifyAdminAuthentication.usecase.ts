import { Inject, Injectable } from '@nestjs/common';

import { CACHE_SERVICE, CacheService } from '@/domain/services/cache.service';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class VerifyAdminAuthenticationUsecase {
  constructor(
    @Inject(CACHE_SERVICE)
    private readonly cacheService: CacheService,
  ) {}

  async execute(code: string): Promise<boolean> {
    try {
      const payload = await this.cacheService.get(code);
      console.log('payload', payload);
      if (!payload) {
        return false;
      }

      return payload === 'admin';
    } catch (error) {
      throw new GenericError(
        'Erro ao validar a autenticação do administrador',
        'VerifyAdminAuthenticationUsecase',
      ).addCompleteError(error);
    }
  }
}
