import { Estate } from "../../domain/entities/estate.entity";
import { GetEstateResponseDto } from "../../application/dtos/get-estate-response.dto";

export class EstateMapper {
  static toResponse(estate: Estate): GetEstateResponseDto {
    return {
      id: estate.id,
      title: estate.title,
      metrage: estate.metrage,
      status: estate.status,
      address: estate.address,
      approximateAddress: estate.approximateAddress,

      estateCode: estate.estateCode,
      estateGrade: estate.estateGrade,
      description: estate.description,
      note: estate.note,
      findBy: estate.findBy,

      buildYear: estate.buildYear,
      floor: estate.floor,
      roomCount: estate.roomCount,
      parkingCount: estate.parkingCount,
      location: estate.location,

      soleMetrage: estate.soleMetrage,
      ayanMetrage: estate.ayanMetrage,
      floorMetrage: estate.floorMetrage,
      banaMetrage: estate.banaMetrage,

      totalPrice: estate.totalPrice?.toNumber() ?? undefined,
      rahnPrice: estate.rahnPrice?.toNumber() ?? undefined,
      ejarePrice: estate.ejarePrice?.toNumber() ?? undefined,
    };
  }
}