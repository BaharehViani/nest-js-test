import { Module } from '@nestjs/common';
import { ManagementController } from './management.controller';
import { ManagementService } from './management.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Module({
  controllers: [ManagementController],
  providers: [ManagementService, PrismaService],
})
export class ManagementModule {}