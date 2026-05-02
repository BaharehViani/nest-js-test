import { IsBoolean, IsString } from "class-validator";

export class SendOtpDto {
  @IsString()
  phoneNumber: string;

  @IsBoolean()
  sendOTP: boolean;
}