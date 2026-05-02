import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from "class-validator";
import { EstateGrade, EstateStatus } from "../../domain/entities/estate.entity";
import { Type } from "class-transformer";

export class AuthHeaderDto {
  @IsString()
  authorization: string;
}

export class ChangeEstateStatusDto {
  @IsEnum(EstateStatus)
  status: EstateStatus;
}

export class CreateEstateDto {
  @IsString()
  title: string;

  @IsNumber()
  metrage: number;

  @IsString()
  address: string;

  @IsString()
  approximateAddress: string;

  // ---- Optional info ----

  @IsOptional() @IsEnum(EstateStatus)
  status?: EstateStatus;

  @IsOptional() @IsEnum(EstateGrade)
  estateGrade?: EstateGrade;

  @IsOptional() @IsString()
  description?: string;

  @IsOptional() @IsString()
  note?: string;

  @IsOptional() @IsString()
  findBy?: string;

  @IsOptional() @IsNumber()
  buildYear?: number;

  @IsOptional() @IsString()
  floor?: string;

  @IsOptional() @IsNumber()
  roomCount?: number;

  @IsOptional() @IsNumber()
  parkingCount?: number;

  @IsOptional() @IsArray()
  location?: string[];

  // ---- metrage details ----
  @IsOptional() @IsNumber() soleMetrage?: number;
  @IsOptional() @IsNumber() ayanMetrage?: number;
  @IsOptional() @IsNumber() floorMetrage?: number;
  @IsOptional() @IsNumber() banaMetrage?: number;

  // ---- price (string → BigInt) ----
  @IsOptional() @IsString() totalPrice?: string;
  @IsOptional() @IsString() rahnPrice?: string;
  @IsOptional() @IsString() ejarePrice?: string;
}


export class GetEstateResponseDto {
  id: string;
  title: string;
  metrage: number;
  status: string;
  address: string;
  approximateAddress: string;

  estateCode?: number;
  estateGrade?: string;
  description?: string;
  note?: string;
  findBy?: string;

  buildYear?: number;
  floor?: string;
  roomCount?: number;
  parkingCount?: number;
  location?: string[];

  soleMetrage?: number;
  ayanMetrage?: number;
  floorMetrage?: number;
  banaMetrage?: number;

  totalPrice?: number;
  rahnPrice?: number;
  ejarePrice?: number;
}


export class GetEstatesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsEnum(EstateStatus)
  status?: EstateStatus;

  @IsOptional()
  @IsEnum(EstateGrade)
  estateGrade?: EstateGrade;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minMetrage?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxMetrage?: number;

  @IsOptional()
  @IsString()
  minPrice?: string;

  @IsOptional()
  @IsString()
  maxPrice?: string;

  @IsOptional()
  @IsString()
  search?: string;
};

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