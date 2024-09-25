import { Module } from '@nestjs/common';

import { TOKEN_SERVICE } from '@/domain/services/token.service';
import { PDF_SERVICE } from '@/domain/services/pdf.service';
import { QRCODE_SERVICE } from '@/domain/services/qrcode.service';
import { CACHE_SERVICE } from '@/domain/services/cache.service';
import { JwTokenService } from '@/infra/services/jwToken.service';
import { ConcreteQrcodeService } from '@/infra/services/qrcode.service';
import { PdfkitService } from '@/infra/services/pdfkit.service';
import { RedisCacheService } from '@/infra/services/redisCache.service';

const services = [
  {
    provide: TOKEN_SERVICE,
    useClass: JwTokenService,
  },
  {
    provide: PDF_SERVICE,
    useClass: PdfkitService,
  },
  {
    provide: QRCODE_SERVICE,
    useClass: ConcreteQrcodeService,
  },
  {
    provide: CACHE_SERVICE,
    useClass: RedisCacheService,
  },
];

@Module({
  imports: [],
  providers: services,
  exports: services,
})
export class ServicesModule {}
