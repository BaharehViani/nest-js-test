import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Headers,
  Req,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as AuthDtos from './auth.dto';
import { getMessage } from '../../../message/message.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('CLIENT/IAM')
@Controller('client/iam/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sendOTP')
  @ApiOkResponse({ type: AuthDtos.SendOtpResponseDto })
  async authSendOTP(@Body() body: AuthDtos.AuthSendOTPDto) {
    const result = await this.authService.authSendOTPService(
      body.phoneNumber,
      body.sendOTP,
    );

    if (result.code == 1)
      return {
        message: result.message,
        isExist: result.isExist,
        isPasswordSet: result.passwordSet,
      };

    throw new BadRequestException(result.message);
  }

  @Post('login')
  @ApiOkResponse({ type: AuthDtos.AuthTokenResponseDto })
  async authLoginOTP(@Body() body: AuthDtos.AuthLoginOTPDto) {
    const getUserInfo = await this.authService.getUserInfoService(
      body.phoneNumber,
    );

    if (!getUserInfo) {
      if (!body.token && body.code) {
        const checkOTPResult = await this.authService.checkOTPService(
          body.phoneNumber,
          body.code,
          body.token,
        );

        if (checkOTPResult.code == 1) {
          return {
            message: checkOTPResult.message,
            token: checkOTPResult.token,
          };
        }

        throw new BadRequestException(checkOTPResult.message);
      }

      if (body.firstName && body.lastName && body.token) {
        const signupResult = await this.authService.authSignUpService(
          body.firstName,
          body.lastName,
          body.token,
        );

        if (signupResult.refreshToken && signupResult.accessToken) {
          return {
            message: signupResult.message,
            accessToken: signupResult.accessToken,
            refreshToken: signupResult.refreshToken,
          };
        }
      }

      throw new BadRequestException(
        getMessage('USER_ERROR', 'ERROR_INVALID_DATA', 'fa'),
      );
    } else if (getUserInfo) {
      const loginResult = await this.authService.authLoginOTPService(
        body.phoneNumber,
        body.code,
        body.password,
      );

      if (loginResult.data?.refreshToken) {
        return {
          message: loginResult.message,
          accessToken: loginResult.data.accessToken,
          refreshToken: loginResult.data.refreshToken,
        };
      }

      throw new BadRequestException(loginResult.message);
    }

    throw new BadRequestException(
      getMessage('USER_ERROR', 'ERROR_INVALID_DATA'),
    );
  }

  @Post('forgetPassword')
  @ApiOkResponse({ type: AuthDtos.AuthTokenResponseDto })
  async forgetPassword(@Body() body: AuthDtos.ForgetPasswordDto) {
    if (body.code && !body.token) {
      const checkOTPResult = await this.authService.checkOTPService(
        body.phoneNumber,
        body.code,
        body.token,
      );
      if (checkOTPResult.code == 1)
        return { message: checkOTPResult.message, token: checkOTPResult.token };
      throw new BadRequestException(checkOTPResult.message);
    }

    if (body.password && body.repeatPassword && body.token) {
      const result = await this.authService.forgetPasswordService(
        body.password,
        body.repeatPassword,
        body.token,
      );
      if (result.code == 1)
        return {
          message: result.message,
          accessToken: result.data?.accessToken,
          refreshToken: result.data?.refreshToken,
        };
    }

    throw new BadRequestException('Invalid data');
  }

  @Post('requestNewAccessTokenWithRefreshToken')
  @ApiOkResponse({ type: AuthDtos.AuthTokenResponseDto })
  async refresh(@Body() body: AuthDtos.RefreshTokenDto) {
    const result =
      await this.authService.requestNewAccessTokenWithRefreshTokenService(
        body.refresh_token,
      );

    if (result.code == 1)
      return {
        message: result.message,
        accessToken: result.data?.accessToken,
        refreshToken: result.data?.refreshToken,
      };

    throw new BadRequestException(result.message);
  }

  @Get('userGetInfo')
  @ApiOkResponse({ type: AuthDtos.UserGetInfoResponseDto })
  async userGetInfo(
    @Req() request: any, @Headers() headers: AuthDtos.AuthHeaderDto,
  ) {
    if (!request.userData) {
      throw new UnauthorizedException(
        getMessage('USER_ERROR', 'ERROR_INVALID_ACCESS'),
      );
    }

    const result = await this.authService.userGetInfoService(request.userData.userId);
    if (result.code == 1)
      return {
        code: result.code,
        message: result.message,
        data: result.data,
      };
    throw new BadRequestException(result.message);
  }
}
