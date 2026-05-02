import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { AUTH_PORT, AuthPort } from "../../domain/ports/auth.port";
import {
  createToken,
  checkExpiration,
  validatePassToken,
} from "src/utils/module";
import bcrypt from "bcrypt";

@Injectable()
export class LoginService {
  constructor(@Inject(AUTH_PORT) private repo: AuthPort) {}

  async execute(phoneNumber: string, code?: string, password?: string) {
    const user = await this.repo.findUserByPhone(phoneNumber);

    if (!user) {
      throw new BadRequestException("شماره موبایل نامعتبر است");
    }

    if (user.isActive === false) {
      throw new BadRequestException("این حساب مسدود است");
    }

    // ================= OTP LOGIN =================
    if (code) {
      const session = await this.repo.findSession(phoneNumber);

      if (!session) throw new BadRequestException("سشن پیدا نشد");

      const isExpired = checkExpiration(session.createdAt.getTime());
      if (isExpired) throw new BadRequestException("otp منقضی شده است");

      if (session.code !== code)
        throw new BadRequestException("otp نامعتبر است");

      await this.repo.deleteSession(phoneNumber);

      const accessToken = await createToken(
        { userId: user.id, accessPerms: user.accessPerms },
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
      );

      const refreshToken = await createToken(
        { userId: user.id, accessPerms: user.accessPerms },
        process.env.REFRESH_TOKEN_PRIVATE_KEY,
        Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
      );

      return {
        message: "کاربر با موفقیت لاگین شد",
        accessToken,
        refreshToken,
      };
    }

    // ================= PASSWORD LOGIN =================
    if (password) {
      if (!user.password)
        throw new BadRequestException("password not set");

      const ok = bcrypt.compareSync(password, user.password);

      if (!ok) throw new BadRequestException("پسورد اشتباه است");

      const accessToken = await createToken(
        { userId: user.id, accessPerms: user.accessPerms },
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
      );

      const refreshToken = await createToken(
        { userId: user.id, accessPerms: user.accessPerms },
        process.env.REFRESH_TOKEN_PRIVATE_KEY,
        Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
      );

      return {
        message: "کاربر با موفقیت لاگین شد",
        accessToken,
        refreshToken,
      };
    }

    throw new BadRequestException("invalid request");
  }
}