import {
  SALE_STAND_REPOSITORY,
  SaleStandRepository,
} from '@/domain/repositories/saleStand.respository';
import { EncodeUtil } from '@/domain/utils/encode.util';
import { TOKEN_SERVICE, TokenService } from '@/domain/services/token.service';
import { saleStandToResponseMapper } from '@/domain/mappers/saleStandToResponse.mapper';
import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from '@/domain/errors/notFound.error';
import { GenericError } from '@/domain/errors/generic.error';

@Injectable()
export class AuthenticateSaleStand {
  constructor(
    @Inject(SALE_STAND_REPOSITORY)
    private readonly saleStandRepository: SaleStandRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
  ) {}

  async execute(code: string) {
    try {
      const encodedCode = EncodeUtil.encodeBase64(code);
      const saleStand = await this.saleStandRepository.findByCode(encodedCode);

      if (!saleStand) {
        throw new NotFoundError(
          'Barraquinha não encontrada',
          'AuthenticateSaleStand',
        );
      }

      return {
        authToken: this.tokenService.generateToken({
          id: saleStand.id,
        }),
        stand: saleStandToResponseMapper(saleStand),
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new GenericError(
        'Erro ao autenticar barraquinha',
        'AuthenticateSaleStand',
      ).addCompleteError(error);
    }
  }
}
