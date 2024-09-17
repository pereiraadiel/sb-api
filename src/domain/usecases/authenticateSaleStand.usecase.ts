import { SaleStandRepository } from '@/domain/repositories/saleStand.respository';
import { EncodeUtil } from '@/domain/utils/encode.util';
import { TokenService } from '@/domain/services/token.service';
import { saleStandToResponseMapper } from '../mappers/saleStandToResponse.mapper';

export class AuthenticateSaleStand {
  constructor(
    private readonly saleStandRepository: SaleStandRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(code: string) {
    try {
      const encodedCode = EncodeUtil.encodeBase64(code);
      const saleStand = await this.saleStandRepository.findByCode(encodedCode);

      if (!saleStand) {
        throw new Error('Sale stand not found');
      }

      return {
        authToken: this.tokenService.generateToken({
          id: saleStand.id,
        }),
        stand: saleStandToResponseMapper(saleStand),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
