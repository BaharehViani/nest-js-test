import { Module } from '@nestjs/common';
import { AuthController } from './presentation/controllers/auth.controller';
import { SendOtpService } from './application/services/send-otp.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaAuthPort } from './infrastructure/prisma/auth.prisma.port';
import { AUTH_PORT } from './domain/ports/auth.port';
import { LoginService } from './application/services/login.service';
import { CheckOtpService } from './application/services/check-otp.service';
import { SignupService } from './application/services/signup.service';
import { ForgetPasswordService } from './application/services/forget-password.service';
import { RefreshTokenService } from './application/services/refresh-token.service';
import { UserGetInfoService } from './application/services/user-get-info.service';

@Module({
  controllers: [AuthController],
  providers: [
    SendOtpService,
    LoginService,
    CheckOtpService,
    SignupService,
    ForgetPasswordService,
    RefreshTokenService,
    UserGetInfoService,
    PrismaService,
    PrismaAuthPort,
    {
      provide: AUTH_PORT,
      useClass: PrismaAuthPort,
    },
  ],
})
export class AuthModule {}
