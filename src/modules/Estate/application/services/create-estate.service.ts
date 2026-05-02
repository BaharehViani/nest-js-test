import { Injectable } from "@nestjs/common";
import { EstatePort } from "../../domain/ports/estate.port";
import { Estate, EstateStatus } from "../../domain/entities/estate.entity";
import { CreateEstateDto } from "../dtos/create-estate-dto";
import { Price } from "../../domain/value-objects/price.vo";

@Injectable()
export class CreateEstateService {
  constructor(private readonly estatePort: EstatePort) {}

  async execute(dto: CreateEstateDto) {
    const estate = new Estate(
      crypto.randomUUID(),
      dto.title,
      dto.metrage,
      dto.status ?? EstateStatus.PENDING,
      dto.address,
      dto.approximateAddress,
      undefined,
      dto.estateGrade,
      dto.description,
      dto.note,
      dto.findBy,
      dto.buildYear,
      dto.floor,
      dto.roomCount,
      dto.parkingCount,
      dto.location ?? [],
      dto.soleMetrage,
      dto.ayanMetrage,
      dto.floorMetrage,
      dto.banaMetrage,
      dto.totalPrice ? Price.create(dto.totalPrice) : undefined,
      dto.rahnPrice ? Price.create(dto.rahnPrice) : undefined,
      dto.ejarePrice ? Price.create(dto.ejarePrice) : undefined,
    );

    return this.estatePort.create(estate);
  }
}