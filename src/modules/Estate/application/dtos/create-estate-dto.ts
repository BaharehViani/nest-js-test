import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
} from "class-validator";
import { EstateGrade, EstateStatus } from "../../domain/entities/estate.entity";

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