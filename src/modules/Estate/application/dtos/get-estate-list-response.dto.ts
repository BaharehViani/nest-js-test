export class GetEstateListResponseDto {
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