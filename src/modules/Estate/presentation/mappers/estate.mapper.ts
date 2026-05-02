import { Estate } from "../../domain/entities/estate.entity";
import { GetEstateListResponseDto } from "../../application/dtos/get-estate-list-response.dto";

export class EstateMapper {
  static toResponse(estate: Estate): GetEstateListResponseDto {
    return {
      ...estate,
      totalPrice: estate.totalPrice?.toString(),
      rahnPrice: estate.rahnPrice?.toString(),
      ejarePrice: estate.ejarePrice?.toString(),
    };
  }
}