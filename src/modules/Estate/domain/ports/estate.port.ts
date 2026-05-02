import { Estate } from "../entities/estate.entity";
import { GetEstatesQueryDto } from "../../application/dtos/get-estates-query.dto"

export abstract class EstatePort {
  abstract create(estate: Estate): Promise<Estate>;
  abstract findById(id: string): Promise<Estate | null>;
  abstract save(estate: Estate): Promise<void>;
  abstract findMany(
  query: GetEstatesQueryDto
): Promise<{ data: Estate[]; total: number }>;

}