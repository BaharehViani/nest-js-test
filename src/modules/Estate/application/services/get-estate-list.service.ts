import { Injectable } from "@nestjs/common";
import { EstatePort } from "../../domain/ports/estate.port";
import { GetEstatesQueryDto } from "../dtos/get-estates-query.dto";

@Injectable()
export class GetEstatesListService {
  constructor(private readonly estatePort: EstatePort) {}

  async execute(query: GetEstatesQueryDto) {

    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    const result = await this.estatePort.findMany({
      ...query,
      page,
      limit,
    });

    return {
      ...result,
      page,
      limit,
    };
  }
}