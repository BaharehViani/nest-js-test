import { Module } from '@nestjs/common';
import { EstateController } from './presentation/controllers/estate.controller';
import { CreateEstateService } from './application/services/create-estate.service';
import { EstatePort } from './domain/ports/estate.port';
import { PrismaEstateAdapter } from './infrastructure/prisma/estate.prisma.adapter';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetEstatesListService } from './application/services/get-estate-list.service';
import { GetEstateService } from './application/services/get-estate.service';
import { UpdateEstateService } from './application/services/update-estate.service';
import { ChangeEstateStatusService } from './application/services/change-estate-status.service';

@Module({
  controllers: [EstateController],
  providers: [
    CreateEstateService,
    GetEstatesListService,
    GetEstateService,
    UpdateEstateService,
    ChangeEstateStatusService,
    PrismaService,
    {
      provide: EstatePort,
      useClass: PrismaEstateAdapter,
    },
  ],
})
export class EstateModule {}
