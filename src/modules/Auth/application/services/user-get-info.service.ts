import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { AuthPort, AUTH_PORT } from "../../domain/ports/auth.port";

@Injectable()
export class UserGetInfoService {
  constructor(@Inject(AUTH_PORT) private port: AuthPort) {}

  async execute(userId: string) {

    const user = await this.port.findUserById(userId);

    if (!user) {
      throw new NotFoundException("کاربر پیدا نشد");
    }

    return {
      message: "اطلاعات با موفقیت ارسال شد",
      data: user,
    };
  }
}