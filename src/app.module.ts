import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/AuthGuard';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService, { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
