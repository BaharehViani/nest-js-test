import { Injectable, Inject } from "@nestjs/common";
import { AUTH_PORT, AuthPort } from "../../domain/ports/auth.port";
import { createToken, checkExpiration } from "src/utils/module";

@Injectable()
export class CheckOtpService {
  constructor(@Inject(AUTH_PORT) private repo: AuthPort) {}

  async execute(phone: string, code: string, token?: string) {
    if (!token) {
      const session = await this.repo.findSession(phone);

      if (!session) throw new Error("session not found");

      const expired = checkExpiration(session.createdAt.getTime());
      if (expired) throw new Error("expired");

      if (session.code !== code) throw new Error("wrong code");

      const signupToken = await createToken(
        { phoneNumber: phone },
        process.env.PASS_TOKEN_PRIVATE_KEY,
        300000,
      );

      await this.repo.deleteSession(phone);

      return {
        token: signupToken,
        message: "otp verified",
      };
    }

    return {
      message: "token exists",
    };
  }
}