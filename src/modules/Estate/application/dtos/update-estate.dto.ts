import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { EstateGrade } from "../../domain/entities/estate.entity";

export class UpdateEstateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  metrage?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  approximateAddress?: string;

  @IsOptional()
  @IsEnum(EstateGrade)
  estateGrade?: EstateGrade;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  findBy?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  roomCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parkingCount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalPrice?: number;
}