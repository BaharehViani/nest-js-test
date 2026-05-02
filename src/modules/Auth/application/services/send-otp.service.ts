import { Inject, Injectable } from "@nestjs/common";
import { generateOTP } from "src/utils/module";
import { getMessage } from "src/message/message.service";
import { AuthPort, AUTH_PORT } from "../../domain/ports/auth.port";

@Injectable()
export class SendOtpService {
  constructor(@Inject(AUTH_PORT) private repo: AuthPort,) {}

  async execute(phoneNumber: string, sendOTP: boolean) {
    let code = generateOTP(6);

    let isExist = false;
    let isPasswordSet = false;

    const user = await this.repo.findUserByPhone(phoneNumber);

    if (user?.id) isExist = true;
    if (user?.password != null) isPasswordSet = true;

    if (user?.isActive === false) {
      return {
        code: 0,
        message: "حساب شما مسدود شده است",
      };
    }

    if (sendOTP || !isExist || (isExist && !isPasswordSet)) {
      const session = await this.repo.findSession(phoneNumber);

      if (session) code = session.code;

      await this.repo.deleteSession(phoneNumber);

      await this.repo.createSession({
        phoneNumber,
        code,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });

      return {
        code: 1,
        message: getMessage("SUCCESS", "SUCCEED_OTPCODE_SEND"),
        isExist,
        isPasswordSet,
      };
    }

    return {
      code: 1,
      message: getMessage("SUCCESS", "SUCCEED_SEND_DATA"),
      isExist,
      isPasswordSet,
    };
  }
}