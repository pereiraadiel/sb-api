import { Controller, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { AuthenticateAdminUsecase } from '@/domain/usecases/authenticateAdmin.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authenticateAdminUsecase: AuthenticateAdminUsecase,
  ) {}

  @Post()
  @Throttle({
    default: { limit: 3, ttl: 15 * 60 * 1000, blockDuration: 3 * 60 * 1000 }, // 3 requests per 15 minutes, block for 3 minutes
  })
  async authenticateAdmin(@Req() req: Request) {
    const { body } = req;
    const { code } = body as any;
    return await this.authenticateAdminUsecase.execute(Number(code));
  }
}
