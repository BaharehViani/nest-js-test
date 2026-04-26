import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
  generateOTP,
  createToken,
  checkExpiration,
  validatePassToken, sendMessage
} from '../../../utils/module';
import { getMessage } from '../../../message/message.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async authSendOTPService(phoneNumber: string, sendOTP: boolean) {
    try {
      let code = generateOTP(6);

      let isExist: boolean = false;
      let isPasswordSet: boolean = false;

      const user = await this.prisma.user.findFirst({
        where: { phoneNumber },
        select: { password: true, id: true, accessPerms: true, isActive: true },
      });

      if (user?.id) isExist = true;
      if (user?.password != null) isPasswordSet = true;

      if (user?.isActive == false) {
        return { code: 0, message: 'حساب شما مسدود شده است' };
      }

      if (sendOTP || !isExist || (isExist && !isPasswordSet)) {
        const sessionExist = await this.prisma.session.findFirst({
          where: { phoneNumber },
        });
        if (sessionExist) code = sessionExist.code;

          const messageResult = await sendMessage(phoneNumber, code , null);
          if(messageResult == false){
              return {code : 0 , message : getMessage("SYSTEM_ERROR", "ERROR_SEND_OTPCODE")}
          }

        await this.prisma.session.deleteMany({ where: { phoneNumber } });

        await this.prisma.session.create({
          data: {
            code,
            phoneNumber,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
          },
        });

        return {
          code: 1,
          message: getMessage('SUCCESS', 'SUCCEED_OTPCODE_SEND'),
          isExist,
          passwordSet: isPasswordSet,
        };
      } else if (isExist && isPasswordSet) {
        return {
          code: 1,
          message: getMessage('SUCCESS', 'SUCCEED_SEND_DATA'),
          isExist,
          passwordSet: isPasswordSet,
        };
      }

      return {
        code: 0,
        message: getMessage('USER_ERROR', 'ERROR_INVALID_DATA'),
      };
    } catch (error: any) {
      return {
        code: 0,
        message: getMessage('SYSTEM_ERROR', 'ERROR_INVALID_DATA'),
      };
    }
  }

  async authLoginOTPService(
    phoneNumber: string,
    code?: string,
    password?: string,
  ) {
    try {
      if (phoneNumber != undefined) {
        if (code != undefined) {
          const user = await this.prisma.user.findFirst({
            where: { phoneNumber },
          });
          if (!user)
            return {
              code: 0,
              message: getMessage('USER_ERROR', 'ERROR_INVALID_PHONENUMBER'),
            };

          const session = await this.prisma.session.findFirst({
            where: { phoneNumber },
          });
          if (!session)
            return {
              code: 0,
              message: getMessage('USER_ERROR', 'ERROR_NOT_FIND'),
            };

          const isExpire = checkExpiration(session.createdAt.getTime());
          if (isExpire)
            return {
              code: 0,
              message: getMessage('USER_ERROR', 'ERROR_OTPCODE_EXPIRED'),
            };
          if (code != session.code)
            return {
              code: 0,
              message: getMessage('USER_ERROR', 'ERROR_INCORECT_OTPCODE'),
            };

          await this.prisma.session.deleteMany({ where: { phoneNumber } });

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
            code: 1,
            message: getMessage('SUCCESS', 'SUCCEED_USER_LOGIN'),
            data: { accessToken, refreshToken },
          };
        } else if (password != undefined) {
          const user = await this.prisma.user.findFirst({
            where: { phoneNumber },
          });
          if (!user?.password)
            return {
              code: 0,
              message: getMessage('USER_ERROR', 'ERROR_PASSWORD_NOT_SET'),
            };

          const checkPassword = bcrypt.compareSync(password, user.password);
          if (!checkPassword)
            return {
              code: 0,
              message: getMessage('USER_ERROR', 'ERROR_INVALID_PASSWORD'),
            };

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
            code: 1,
            message: getMessage('SUCCESS', 'SUCCEED_USER_LOGIN'),
            data: { accessToken, refreshToken },
          };
        }

        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_INVALID_DATA'),
        };
      }

      return {
        code: 0,
        message: getMessage('USER_ERROR', 'ERROR_PHONENUMBER_NULL'),
      };
    } catch {
      return {
        code: 0,
        message: getMessage('SYSTEM_ERROR', 'ERROR_INVALID_DATA'),
      };
    }
  }

  async forgetPasswordService(
    password: string,
    repeatPassword: string,
    token: string,
  ) {
    try {
      const tokenResult: any = await validatePassToken(token);

      if (tokenResult.code == 0) {
        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_INVALID_ACCESS'),
        };
      }

      const user = await this.prisma.user.findFirst({
        where: {
          phoneNumber: tokenResult.decode.phoneNumber,
        },
      });

      if (!user) {
        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_USER_NOT_FIND'),
        };
      }

      if (password != repeatPassword) {
        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_REPEAT_PASSWORD'),
        };
      }

      const hashPassword = bcrypt.hashSync(password, 12);

      const updateUserPassword = await this.prisma.user.update({
        where: {
          phoneNumber: tokenResult.decode.phoneNumber,
        },
        data: {
          password: hashPassword,
        },
      });

      //delete session info
      const sessionDelete = await this.prisma.session.deleteMany({
        where: { phoneNumber: tokenResult.decode.phoneNumber },
      });

      //generate token
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

      if (!accessToken || !refreshToken) {
        return {
          code: 0,
          message: getMessage('SYSTEM_ERROR', 'ERROR_CREATE_TOKEN'),
        };
      }

      return {
        code: 1,
        message: getMessage('SUCCESS', 'SUCCEED_USER_LOGIN'),
        data: { accessToken: accessToken, refreshToken: refreshToken },
      };
    } catch (error) {
      return {
        code: 0,
        message: getMessage('SYSTEM_ERROR', 'ERROR_INVALID_DATA'),
      };
    }
  }

  async authSignUpService(firstName: string, lastName: string, token: string) {
    try {
      const tokenResult: any = await validatePassToken(token);

      if (tokenResult.code == 0) {
        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_INVALID_REGISTER_TOKEN'),
        };
      }

      const user = await this.prisma.user.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          phoneNumber: tokenResult.decode.phoneNumber,
          accessPerms: ['USER'],
        },
      });

      //generate token
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

      if (!accessToken || !refreshToken) {
        return {
          code: 0,
          message: getMessage('SYSTEM_ERROR', 'ERROR_CREATE_TOKEN'),
        };
      }

      await this.prisma.session.deleteMany({
        where: {
          phoneNumber: tokenResult.decode.phoneNumber,
        },
      });

      return {
        code: 1,
        message: getMessage('SUCCESS', 'SUCCEED_SAVE_DATA'),
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (error) {
      return {
        code: 0,
        message: getMessage('USER_ERROR', 'ERROR_EXIST_PHONENUMBER'),
      };
    }
  }

  async requestNewAccessTokenWithRefreshTokenService(token: string) {
    try {
      const accessTokenPrivateKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
      const refreshTokenPrivateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

      if (!accessTokenPrivateKey || !refreshTokenPrivateKey) {
        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_INVALID_DATA'),
        };
      }

      const decode: any = jwt.verify(token, refreshTokenPrivateKey);

      if (!decode) {
        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_REFRESH_TOKEN'),
        };
      }

      const user = await this.prisma.user.findFirst({
        where: {
          id: decode.userId,
        },
      });

      if (!user) {
        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_NOT_FIND'),
        };
      }

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

      if (!accessToken || !refreshToken) {
        return {
          code: 0,
          message: getMessage('SYSTEM_ERROR', 'ERROR_CREATE_TOKEN'),
        };
      }

      return {
        code: 1,
        message: getMessage('SUCCESS', 'SUCCEED_CREATE_NEW_TOKEN'),
        data: { accessToken: accessToken, refreshToken: refreshToken },
      };
    } catch (error) {
      return {
        code: 0,
        message: getMessage('SYSTEM_ERROR', 'ERROR_INVALID_DATA'),
      };
    }
  }

  async checkOTPService(
    phoneNumber: string,
    code: string,
    token: string | undefined,
  ) {
    if (!token) {
      const session = await this.prisma.session.findFirst({
        where: {
          phoneNumber: phoneNumber,
        },
      });

      if (!session) {
        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_EXIST_SESSION'),
        };
      }

      const isExpired = checkExpiration(session.createdAt.getTime());

      if (isExpired == true) {
        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_OTPCODE_EXPIRED'),
        };
      }

      if (code != session.code) {
        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_INCORECT_OTPCODE'),
        };
      }

      //generate signup token
      const token = await createToken(
        { phoneNumber: phoneNumber },
        process.env.PASS_TOKEN_PRIVATE_KEY,
        300000,
      );

      if (!token) {
        return {
          code: 0,
          message: getMessage('SYSTEM_ERROR', 'ERROR_CREATE_TOKEN'),
        };
      }

      const deleteSession = await this.prisma.session.deleteMany({
        where: {
          phoneNumber: phoneNumber,
        },
      });

      return {
        code: 1,
        message: getMessage('SUCCESS', 'SUCCEED_CREATE_REGISTER_CODE'),
        token: token,
      };
    } else {
      return {
        code: 1,
        message: getMessage('SUCCESS', 'SUCCEED_EXIST_TOKEN'),
      };
    }
  }

  async getUserInfoService(phoneNumber: string | undefined) {
    try {
      const result = await this.prisma.user.findFirst({
        where: {
          phoneNumber: phoneNumber,
        },
      });

      return result !== null;
    } catch (error) {
      return false;
    }
  }

  async userGetInfoService(id: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
      });

      if (!user) {
        return {
          code: 0,
          message: getMessage('USER_ERROR', 'ERROR_USER_NOT_FIND'),
        };
      }

      return {
        code: 1,
        data: user,
        message: getMessage('SUCCESS', 'SUCCEED_SEND_DATA'),
      };
    } catch (error) {
      return {
        code: 0,
        message: getMessage('SYSTEM_ERROR', 'ERROR_INVALID_DATA'),
      };
    }
  }
}
