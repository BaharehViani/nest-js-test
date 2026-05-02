import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/IAM/auth/auth.module';
import { ManagementModule } from './modules/IAM/management/management.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/AuthGuard';
import { EstateModule } from './modules/Estate/estate.module';

@Module({
  imports: [PrismaModule, AuthModule, ManagementModule, EstateModule],
  controllers: [AppController],
  providers: [
    AppService, { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
