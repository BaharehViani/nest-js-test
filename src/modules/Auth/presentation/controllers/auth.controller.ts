import { Controller,Headers, Post, Body, BadRequestException, Get, UnauthorizedException, Req } from "@nestjs/common";
import { SendOtpService } from "../../application/services/send-otp.service";
import { LoginService } from "../../application/services/login.service";
import { ForgetPasswordService } from "../../application/services/forget-password.service";
import { RefreshTokenService } from "../../application/services/refresh-token.service";
import { UserGetInfoService } from "../../application/services/user-get-info.service";
import * as AuthDtos from '../../application/dtos/auth.dto';
import { ApiOkResponse } from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
  constructor(private readonly sendOtpService: SendOtpService,
    private readonly loginService: LoginService,
    private readonly forgetPasswordService: ForgetPasswordService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly userGetInfoService: UserGetInfoService,
  ) {}

  @Post("sendOTP")
  @ApiOkResponse({ type: AuthDtos.SendOtpResponseDto })
  async sendOtpController(@Body() body: AuthDtos.AuthSendOTPDto) {
    const result = await this.sendOtpService.execute(
      body.phoneNumber,
      body.sendOTP,
    );

    if (result.code === 1) {
      return {
        message: result.message,
        isExist: result.isExist,
        isPasswordSet: result.isPasswordSet,
      };
    }

    throw new BadRequestException(result.message);
  }

  @Post("login")
  @ApiOkResponse({ type: AuthDtos.AuthTokenResponseDto })
  async loginUserController(@Body() body: AuthDtos.AuthLoginOTPDto) {
    return this.loginService.execute(body.phoneNumber, body.code, body.password);
  }

  @Post("forgetPassword")
  @ApiOkResponse({ type: AuthDtos.AuthTokenResponseDto })
  async forgetPasswordController(@Body() body: AuthDtos.ForgetPasswordDto) {
    return this.forgetPasswordService.execute(body);
  }

  @Post("requestNewAccessTokenWithRefreshToken")
  @ApiOkResponse({ type: AuthDtos.AuthTokenResponseDto })
    async newTokenWithRefreshTokenController(@Body() body: AuthDtos.RefreshTokenDto) {
    const result = await this.refreshTokenService.execute(body.refresh_token);

    if (result.code === 1) {
        return {
        message: result.message,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        };
    }

    throw new BadRequestException(result.message);
  }

  @Get("userGetInfo")
  @ApiOkResponse({ type: AuthDtos.UserGetInfoResponseDto })
  async userGetInfoController(@Req() req: any, @Headers() headers: AuthDtos.AuthHeaderDto,) {

    if (!req.userData) {
      throw new UnauthorizedException("دسترسی نامعتبر است");
    }

    const result = await this.userGetInfoService.execute(req.userData.userId);

    return {
      message: result.message,
      data: result.data,
    };
  }
}