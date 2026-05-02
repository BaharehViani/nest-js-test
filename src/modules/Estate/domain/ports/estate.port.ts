import { Estate } from "../entities/estate.entity";
import * as EstateDtos from '../../application/dtos/estate.dto';

export abstract class EstatePort {
  abstract create(estate: Estate): Promise<Estate>;
  abstract findById(id: string): Promise<Estate | null>;
  abstract save(estate: Estate): Promise<void>;
  abstract findMany(
  query: EstateDtos.GetEstatesQueryDto
): Promise<{ data: Estate[]; total: number }>;

}