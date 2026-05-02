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


  publish() {
    if (this.status === EstateStatus.PUBLISH)
      throw new Error("ملک منتشر شده است");

    this.status = EstateStatus.PUBLISH;
  }

  unpublish() {
    if (this.status === EstateStatus.PENDING)
      throw new Error("ملک در وضعیت غیر فعال قرار دارد");

    this.status = EstateStatus.PENDING;
  }

  updateInfo(payload: {
    title?: string;
    metrage?: number;
    address?: string;
    approximateAddress?: string;
    estateGrade?: EstateGrade;
    description?: string;
    note?: string;
    findBy?: string;
    roomCount?: number;
    parkingCount?: number;
    totalPrice?: Price;
  }) {
    if (payload.title !== undefined) this.title = payload.title;
    if (payload.metrage !== undefined) this.metrage = payload.metrage;
    if (payload.address !== undefined) this.address = payload.address;
    if (payload.approximateAddress !== undefined) this.approximateAddress = payload.approximateAddress;
    if (payload.estateGrade !== undefined) this.estateGrade = payload.estateGrade;
    if (payload.description !== undefined) this.description = payload.description;
    if (payload.note !== undefined) this.note = payload.note;
    if (payload.findBy !== undefined) this.findBy = payload.findBy;
    if (payload.roomCount !== undefined) this.roomCount = payload.roomCount;
    if (payload.parkingCount !== undefined) this.parkingCount = payload.parkingCount;
    if (payload.totalPrice !== undefined) this.totalPrice = payload.totalPrice;
  }
}