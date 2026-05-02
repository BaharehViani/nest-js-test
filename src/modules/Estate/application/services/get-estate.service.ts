import { Injectable, NotFoundException } from "@nestjs/common";
import { EstatePort } from "../../domain/ports/estate.port";

@Injectable()
export class GetEstateService {
  constructor(private readonly estatePort: EstatePort) {}

  async execute(id: string) {
    const estate = await this.estatePort.findById(id);
    if (!estate) throw new NotFoundException("Estate not found");
    return estate;
  }
}