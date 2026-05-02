import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EstatePort } from '../../domain/ports/estate.port';
import { GetEstatesQueryDto } from '../../application/dtos/get-estates-query.dto';
import { Price } from "../../domain/value-objects/price.vo";
import {
  Estate as EstateEntity,
  EstateStatus as DomainEstateStatus,
  EstateGrade as DomainEstateGrade,
} from '../../domain/entities/estate.entity';

import {
  Estate as PrismaEstate,
  EstateStatus as PrismaEstateStatus,
  EstateGrade as PrismaEstateGrade,
} from '@prisma/client';

@Injectable()
export class PrismaEstatePort implements EstatePort {
  constructor(private prisma: PrismaService) {}

  // mapper: Domain -> Prisma
  private toPrismaStatus(status: DomainEstateStatus): PrismaEstateStatus {
    return status as PrismaEstateStatus;
  }

  private toDomainStatus(status: PrismaEstateStatus): DomainEstateStatus {
    return status as DomainEstateStatus;
  }

  private toPrismaGrade(grade?: DomainEstateGrade): PrismaEstateGrade | null {
    return grade ? (grade as PrismaEstateGrade) : null;
  }

  private toDomainGrade(
    grade?: PrismaEstateGrade | null,
  ): DomainEstateGrade | undefined {
    return grade ? (grade as DomainEstateGrade) : undefined;
  }

  private toDomain(data: PrismaEstate): EstateEntity {
    return new EstateEntity(
      data.id,
      data.title,
      data.metrage,
      this.toDomainStatus(data.status),
      data.address,
      data.approximateAddress,
      data.estateCode,
      this.toDomainGrade(data.estateGrade),
      data.description ?? undefined,
      data.note ?? undefined,
      data.findBy ?? undefined,
      data.buildYear ?? undefined,
      data.floor ?? undefined,
      data.roomCount ?? undefined,
      data.parkingCount ?? undefined,
      data.location,
      data.soleMetrage ?? undefined,
      data.ayanMetrage ?? undefined,
      data.floorMetrage ?? undefined,
      data.banaMetrage ?? undefined,
      data.totalPrice ? Price.create(data.totalPrice) : undefined,
      data.rahnPrice ? Price.create(data.rahnPrice) : undefined,
      data.ejarePrice ? Price.create(data.ejarePrice) : undefined,
    );
  }

  async create(estate: EstateEntity): Promise<EstateEntity> {
    const data = await this.prisma.estate.create({
      data: {
        id: estate.id,
        title: estate.title,
        metrage: estate.metrage,
        status: this.toPrismaStatus(estate.status),
        address: estate.address,
        approximateAddress: estate.approximateAddress,
        estateGrade: this.toPrismaGrade(estate.estateGrade),

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

        totalPrice: estate.totalPrice?.value ?? null,
        rahnPrice: estate.rahnPrice?.value ?? null,
        ejarePrice: estate.ejarePrice?.value ?? null,
      },
    });

    return this.toDomain(data);
  }

  async findById(id: string): Promise<EstateEntity | null> {
    const data = await this.prisma.estate.findUnique({ where: { id } });
    if (!data) return null;

    return this.toDomain(data);
  }

  async save(estate: EstateEntity): Promise<void> {
    await this.prisma.estate.update({
      where: { id: estate.id },
      data: {
        id: estate.id,
        title: estate.title,
        metrage: estate.metrage,
        status: this.toPrismaStatus(estate.status),
        address: estate.address,
        approximateAddress: estate.approximateAddress,
        estateGrade: this.toPrismaGrade(estate.estateGrade),

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

        totalPrice: estate.totalPrice?.value ?? null,
        rahnPrice: estate.rahnPrice?.value ?? null,
        ejarePrice: estate.ejarePrice?.value ?? null,
      },
    });
  }

  async findMany(query: GetEstatesQueryDto) {
  const { page, limit } = query;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (query.status)
    where.status = query.status;

  if (query.estateGrade)
    where.estateGrade = query.estateGrade;

  if (query.search)
    where.title = { contains: query.search, mode: "insensitive" };

  if (query.minMetrage || query.maxMetrage)
    where.metrage = {
      gte: query.minMetrage,
      lte: query.maxMetrage,
    };

  if (query.minPrice || query.maxPrice)
    where.totalPrice = {
      gte: query.minPrice ? BigInt(query.minPrice) : undefined,
      lte: query.maxPrice ? BigInt(query.maxPrice) : undefined,
    };

  const [items, total] = await Promise.all([
    this.prisma.estate.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    this.prisma.estate.count({ where }),
  ]);

  return {
    data: items.map((i) => this.toDomain(i)),
    total,
  };
}
}
