import { Module } from "@nestjs/common";

import { TOKEN_SERVICE } from "@/domain/services/token.service";
import { JwTokenService } from "@/infra/services/jwToken.service";

const services = [
	{
		provide: TOKEN_SERVICE,
		useClass: JwTokenService
	}
]

@Module({
	imports: [],
	providers: services,
	exports: services,
})
export class ServicesModule {}