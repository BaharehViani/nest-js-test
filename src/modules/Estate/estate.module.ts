import { Module } from "@nestjs/common";
import { EstateController  } from "./presentation/controllers/estate.controller";
import { CreateEstateService } from "./application/services/create-estate.service";
import { EstatePort } from "./domain/ports/estate.port";
import { PrismaEstatePort } from "./infrastructure/prisma/estate.prisma.port";
import { PrismaService } from "src/prisma/prisma.service";
import { GetEstatesListService } from "./application/services/get-estate-list.service";
import { GetEstateService } from "./application/services/get-estate.service";

@Module({
  controllers: [EstateController ],
  providers: [
    CreateEstateService, GetEstatesListService, GetEstateService,
    PrismaService,
    {
      provide: EstatePort,
      useClass: PrismaEstatePort,
    },
  ],
})
export class EstateModule {}