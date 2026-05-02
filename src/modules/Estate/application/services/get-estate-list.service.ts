import { Injectable } from "@nestjs/common";
import { EstatePort } from "../../domain/ports/estate.port";
import * as EstateDtos from '../../application/dtos/estate.dto';

@Injectable()
export class GetEstatesListService {
  constructor(private readonly estatePort: EstatePort) {}

  async execute(query: EstateDtos.GetEstatesQueryDto) {

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