import { Injectable, BadRequestException, Inject } from "@nestjs/common";
import { AuthPort, AUTH_PORT } from "../../domain/ports/auth.port";
import { createToken } from "src/utils/module";
import jwt, { JwtPayload } from "jsonwebtoken";

@Injectable()
export class RefreshTokenService {
  constructor(@Inject(AUTH_PORT) private port: AuthPort) {}

  async execute(token: string) {
    const accessKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    const refreshKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

    if (!accessKey || !refreshKey) {
      throw new BadRequestException("missing jwt config");
    }

    // VERIFY REFRESH TOKEN
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, refreshKey) as JwtPayload;
    } catch (err) {
      throw new BadRequestException("invalid refresh token");
    }

    if (!decoded || typeof decoded === "string" || !decoded.userId) {
      throw new BadRequestException("invalid token payload");
    }

    // FIND USER
    const user = await this.port.findUserById(decoded.userId);

    if (!user) {
      throw new BadRequestException("user not found");
    }

    // CREATE NEW TOKENS
    const newAccessToken = await createToken(
      { userId: user.id, accessPerms: user.accessPerms },
      accessKey,
      Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    );

    const newRefreshToken = await createToken(
      { userId: user.id, accessPerms: user.accessPerms },
      refreshKey,
      Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    );

    return {
      code: 1,
      message: "token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}