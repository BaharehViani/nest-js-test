import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ManagementModule } from './modules/IAM/management/management.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/AuthGuard';
import { EstateModule } from './modules/Estate/estate.module';
import { AuthModule } from './modules/Auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule, ManagementModule, EstateModule, ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
