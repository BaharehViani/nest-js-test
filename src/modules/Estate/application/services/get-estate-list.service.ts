import { Injectable } from "@nestjs/common";
import { EstatePort } from "../../domain/ports/estate.port";
import { GetEstatesQueryDto } from "../dtos/get-estates-query.dto";

@Injectable()
export class GetEstatesListService {
  constructor(private readonly estatePort: EstatePort) {}

  async execute(query: GetEstatesQueryDto) {
    return this.estatePort.findMany(query);
  }
}