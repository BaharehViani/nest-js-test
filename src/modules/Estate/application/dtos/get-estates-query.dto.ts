import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
import { EstateStatus, EstateGrade } from "../../domain/entities/estate.entity";

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
}