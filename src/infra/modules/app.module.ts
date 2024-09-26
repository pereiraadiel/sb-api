import { Module } from '@nestjs/common';
import { ControllersModule } from './controllers.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ControllersModule,
    ThrottlerModule.forRoot([
      {
        ttl: 60 * 60 * 1000, // 1 hour
        limit: 10,
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
