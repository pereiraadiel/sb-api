import { Module } from '@nestjs/common';

import { PrismaProvider } from '@/infra/database/prisma.provider';

@Module({
  providers: [PrismaProvider],
  exports: [PrismaProvider],
})
export class DatabaseModule {}
