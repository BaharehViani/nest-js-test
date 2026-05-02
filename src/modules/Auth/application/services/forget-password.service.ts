import { Injectable, Inject, BadRequestException } from "@nestjs/common";
import { AUTH_PORT, AuthPort } from "../../domain/ports/auth.port";
import { validatePassToken, createToken } from "src/utils/module";
import bcrypt from "bcrypt";
import { JwtPayload } from "jsonwebtoken";

@Injectable()
export class ForgetPasswordService {
  constructor(@Inject(AUTH_PORT) private port: AuthPort) {}

  async execute(dto: {
    phoneNumber: string;
    code?: string;
    token?: string;
    password?: string;
    repeatPassword?: string;
  }) {

    // STEP 1: OTP CHECK
    if (dto.code && !dto.token && !dto.password) {
      const session = await this.port.findSession(dto.phoneNumber);

      if (!session) {
        throw new BadRequestException("session not found");
      }

      if (session.code !== dto.code) {
        throw new BadRequestException("invalid otp");
      }

      return {
        message: "otp verified",
      };
    }

    // STEP 2: RESET PASSWORD
    if (dto.password && dto.repeatPassword && dto.token) {

      const tokenResult = await validatePassToken(dto.token);

      if (tokenResult.code === 0 || !tokenResult.decode) {
        throw new BadRequestException("invalid token");
      }

      const decoded = tokenResult.decode as JwtPayload;

      if (!decoded || typeof decoded === "string" || !decoded.phoneNumber) {
        throw new BadRequestException("invalid token payload");
      }

      const phoneNumber = decoded.phoneNumber;

      const user = await this.port.findUserByPhone(phoneNumber);

      if (!user) {
        throw new BadRequestException("user not found");
      }

      if (dto.password !== dto.repeatPassword) {
        throw new BadRequestException("password mismatch");
      }

      const hash = bcrypt.hashSync(dto.password, 12);

      await this.port.updateUserPassword(phoneNumber, hash);
      await this.port.deleteSession(phoneNumber);

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
        message: "پسورد با موفقیت به روز شد",
        accessToken,
        refreshToken,
      };
    }

    throw new BadRequestException("اطلاعات ارسالی نامعتبر است");
  }
}