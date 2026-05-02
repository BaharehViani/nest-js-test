import { Price } from "../value-objects/price.vo";

export enum EstateStatus {
  PENDING = "PENDING",
  PUBLISH = "PUBLISH",
}

export enum EstateGrade {
  GOOD = "GOOD",
  NORMAL = "NORMAL",
  BAD = "BAD",
}

export class Estate {
  constructor(
    public readonly id: string,
    public title: string,
    public metrage: number,
    public status: EstateStatus,
    public address: string,
    public approximateAddress: string,

    public estateCode?: number,
    public estateGrade?: EstateGrade,
    public description?: string,
    public note?: string,
    public findBy?: string,

    public buildYear?: number,
    public floor?: string,
    public roomCount?: number,
    public parkingCount?: number,
    public location: string[] = [],

    public soleMetrage?: number,
    public ayanMetrage?: number,
    public floorMetrage?: number,
    public banaMetrage?: number,

    public totalPrice?: Price,
    public rahnPrice?: Price,
    public ejarePrice?: Price,
  ) {}
}