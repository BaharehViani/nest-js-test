import { Injectable, NotFoundException } from "@nestjs/common";
import { EstatePort } from "../../domain/ports/estate.port";
import { EstateStatus } from "../../domain/entities/estate.entity";

@Injectable()
export class ChangeEstateStatusService {
  constructor(private readonly estatePort: EstatePort) {}

  async execute(id: string, status: EstateStatus) {
    const estate = await this.estatePort.findById(id);
    if (!estate) throw new NotFoundException("ملک یافت نشد");

    if (status === EstateStatus.PUBLISH) estate.publish();
    else estate.unpublish();

    await this.estatePort.save(estate);
    return estate;
  }
}