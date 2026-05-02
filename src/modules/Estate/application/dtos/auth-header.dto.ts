import { IsString } from "class-validator";

export class AuthHeaderDto {
  @IsString()
  authorization: string;
}