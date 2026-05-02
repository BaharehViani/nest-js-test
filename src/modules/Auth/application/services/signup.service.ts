import { Injectable, Inject } from "@nestjs/common";
import { AUTH_PORT, AuthPort } from "../../domain/ports/auth.port";
import { validatePassToken, createToken } from "src/utils/module";

@Injectable()
export class SignupService {
  constructor(@Inject(AUTH_PORT) private repo: AuthPort) {}

  async execute(firstName: string, lastName: string, token: string) {
    const decoded: any = await validatePassToken(token);

    if (decoded.code === 0) throw new Error("invalid token");

    const user = await this.repo.createUser({
      firstName,
      lastName,
      phoneNumber: decoded.decode.phoneNumber,
      accessPerms: ["USER"],
    });

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

    await this.repo.deleteSession(decoded.decode.phoneNumber);

    return {
      message: "signup success",
      accessToken,
      refreshToken,
    };
  }
}