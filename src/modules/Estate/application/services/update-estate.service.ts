import { Injectable, NotFoundException } from "@nestjs/common";
import { EstatePort } from "../../domain/ports/estate.port";
import * as EstateDtos from '../../application/dtos/estate.dto';
import { Price } from "../../domain/value-objects/price.vo";

@Injectable()
export class UpdateEstateService {
  constructor(private readonly estatePort: EstatePort) {}

  async execute(id: string, dto: EstateDtos.UpdateEstateDto) {
    const estate = await this.estatePort.findById(id);
    if (!estate) throw new NotFoundException("ملک یافت نشد");

      estate.updateInfo({
        ...dto,
        totalPrice: dto.totalPrice !== undefined ? Price.create(dto.totalPrice) : undefined,
    });

    await this.estatePort.save(estate);
    return estate;
  }
}