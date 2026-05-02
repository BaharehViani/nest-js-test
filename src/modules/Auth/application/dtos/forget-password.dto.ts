import { IsOptional, IsString } from "class-validator";

export class ForgetPasswordDto {
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  repeatPassword?: string;
}