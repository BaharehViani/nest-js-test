// infrastructure/prisma/auth.prisma.port.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthPort } from "../../domain/ports/auth.port";

@Injectable()
export class PrismaAuthPort implements AuthPort {
  constructor(private prisma: PrismaService) {}

  async findUserByPhone(phoneNumber: string) {
    return this.prisma.user.findFirst({
      where: { phoneNumber },
      select: {
        id: true,
        password: true,
        accessPerms: true,
        isActive: true,
      },
    });
  }

  findUserById(id: string) {
    return this.prisma.user.findFirst({ where: { id } });
  }

  async findSession(phoneNumber: string) {
    return this.prisma.session.findFirst({
      where: { phoneNumber },
    });
  }

  async deleteSession(phoneNumber: string) {
    await this.prisma.session.deleteMany({
      where: { phoneNumber },
    });
  }

  async createSession(data: {
    phoneNumber: string;
    code: string;
    expiresAt: Date;
  }) {
    await this.prisma.session.create({
      data,
    });
  }

  async createUser(data: any) {
    return this.prisma.user.create({ data });
  }

  async updateUserPassword(phone: string, password: string) {
    await this.prisma.user.update({
      where: { phoneNumber: phone },
      data: { password },
    });
  }
}