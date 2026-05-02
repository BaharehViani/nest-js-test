import { IsEnum } from "class-validator";
import { EstateStatus } from "../../domain/entities/estate.entity";

export class ChangeEstateStatusDto {
  @IsEnum(EstateStatus)
  status: EstateStatus;
}