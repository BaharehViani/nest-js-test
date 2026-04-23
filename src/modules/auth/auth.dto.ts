import { IsBoolean, IsString, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class AuthHeaderDto {
  authorization: string;
}

export class AuthSendOTPDto {
  @IsString()
  phoneNumber: string;

  @IsBoolean()
  sendOTP: boolean = false;
}

export class AuthLoginOTPDto {
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;
}

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

export class RefreshTokenDto {
  @IsString()
  refresh_token: string;
}

export class SendOtpResponseDto {
  code: number;
  message: string;
  isExist: boolean;
  passwordSet: boolean;
}

export class AuthTokenResponseDto {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export class CheckOtpResponseDto {
  message: string;
  token: string;
}

export class UserGetInfoResponseDto {
  code: number;
  message: string;
  data: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    password: string;
    isActive: boolean;
    accessPerms: string[];
    cratedAt: Date;
    updatedAt: Date;
  }
}