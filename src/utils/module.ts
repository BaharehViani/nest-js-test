import jwt from "jsonwebtoken";
import { PrismaClient, FunctionalPermission } from "@prisma/client";

const prisma = new PrismaClient();

export const permissionMap: Record<string, FunctionalPermission[]> = {
  "/api/v1/admin/management/personal/edit": [FunctionalPermission.SUPER_USER],
  "/api/v1/admin/management/user/edit": [FunctionalPermission.EDIT_USERS],
  "/api/v1/admin/management/status/edit": [FunctionalPermission.EDIT_USERS],
  "/api/v1/admin/management/user/getList": [FunctionalPermission.GET_USER],
  //به خاطر اینکه داریم سمت پنل مشتری ها هم از این ها استفاده میکنیم برای همین اینا کامنت شده
  //مشکل امنیت هم اونقدرام ندار چون باید آیدی کاربر بتونن حدس بزنن تا بتونن اطلاعاتشو پیدا کنن که خیلی سخته
  //"/api/v1/admin/management/user/get": [FunctionalPermission.GET_USER],
  //"/api/v1/admin/management/personal/get": [FunctionalPermission.GET_USER],
  "/api/v1/admin/category/create": [FunctionalPermission.CREATE_CAT],
  "/api/v1/admin/category/edit": [FunctionalPermission.EDIT_CAT],
  "/api/v1/admin/category/delete": [FunctionalPermission.EDIT_CAT],
  "/api/v1/admin/landing/create": [FunctionalPermission.SUPER_USER],
  "/api/v1/admin/landing/edit": [FunctionalPermission.SUPER_USER],
  "/api/v1/admin/landing/getList": [FunctionalPermission.SUPER_USER],
  "/api/v1/admin/landing/getinfo": [FunctionalPermission.SUPER_USER],
  "/api/v1/admin/landing/delete": [FunctionalPermission.SUPER_USER],
  "/api/v1/admin/estate/create": [
    FunctionalPermission.CREATE_ESTATE,
    FunctionalPermission.MANAGE_ESTATE,
  ],
  "/api/v1/admin/estate/getCreatedList": [
    FunctionalPermission.CREATE_ESTATE,
    FunctionalPermission.MANAGE_ESTATE,
    FunctionalPermission.GET_ESTATE,
  ],
  "/api/v1/admin/estate/editStatus": [FunctionalPermission.MANAGE_ESTATE],
  "/api/v1/admin/estate/getList": [
    FunctionalPermission.CREATE_ESTATE,
    FunctionalPermission.MANAGE_ESTATE,
    FunctionalPermission.GET_ESTATE,
  ],
  "/api/v1/admin/estate/get": [
    FunctionalPermission.CREATE_ESTATE,
    FunctionalPermission.MANAGE_ESTATE,
    FunctionalPermission.GET_ESTATE,
  ],
  "/api/v1/admin/estate/edit": [
    FunctionalPermission.CREATE_ESTATE,
    FunctionalPermission.MANAGE_ESTATE,
  ],
  "/api/v1/admin/estate/requestArchive": [
    FunctionalPermission.CREATE_ESTATE,
    FunctionalPermission.MANAGE_ESTATE,
    FunctionalPermission.GET_ESTATE,
  ],
  "/api/v1/admin/estate/getAdviserList": [
    FunctionalPermission.MANAGE_ESTATE,
    FunctionalPermission.MANAGE_SESSION,
    FunctionalPermission.CREATE_SESSION,
    FunctionalPermission.CREATE_ESTATE,
  ],
  "/api/v1/admin/estate/getRequestList": [FunctionalPermission.MANAGE_ESTATE],
  "/api/v1//admin/estate/getOwnRequestList": [
    FunctionalPermission.CREATE_ESTATE,
    FunctionalPermission.MANAGE_ESTATE,
    FunctionalPermission.GET_ESTATE,
  ],
  "/api/v1/admin/owner/create": [
    FunctionalPermission.CREATE_ESTATE,
    FunctionalPermission.MANAGE_ESTATE,
  ],
  "/api/v1/admin/owner/getList": [
    FunctionalPermission.CREATE_ESTATE,
    FunctionalPermission.MANAGE_ESTATE,
  ],
  "/api/v1/admin/session/create": [
    FunctionalPermission.CREATE_SESSION,
    FunctionalPermission.MANAGE_SESSION,
  ],
  "/api/v1/admin/session/createDate": [FunctionalPermission.MANAGE_SESSION],
  "/api/v1/admin/session/getCountList": [FunctionalPermission.MANAGE_SESSION],
  "/api/v1/admin/session/getList": [FunctionalPermission.MANAGE_SESSION],
  "/api/v1/admin/session/getCountCreatedList": [
    FunctionalPermission.MANAGE_SESSION,
    FunctionalPermission.CREATE_SESSION,
    FunctionalPermission.GET_SESSION,
  ],
  "/api/v1/admin/session/getCreatedList": [
    FunctionalPermission.MANAGE_SESSION,
    FunctionalPermission.CREATE_SESSION,
    FunctionalPermission.GET_SESSION,
  ],
  "/api/v1/admin/session/getDateList": [
    FunctionalPermission.MANAGE_SESSION,
    FunctionalPermission.CREATE_SESSION,
    FunctionalPermission.GET_SESSION,
  ],
  "/api/v1/admin/session/get": [
    FunctionalPermission.MANAGE_SESSION,
    FunctionalPermission.CREATE_SESSION,
    FunctionalPermission.GET_SESSION,
  ],
  "/api/v1/admin/session/edit": [
    FunctionalPermission.MANAGE_SESSION,
    FunctionalPermission.CREATE_SESSION,
  ],
  "/api/v1/admin/session/editStatus": [FunctionalPermission.MANAGE_SESSION],
  "/api/v1/admin/session/deleteDate": [FunctionalPermission.MANAGE_SESSION],
  "/api/v1/admin/estate/getArchiveList": [
    FunctionalPermission.MANAGE_ESTATE,
    FunctionalPermission.GET_ARCHIVE,
  ],
};

export function generateOTP(length: number): string {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}
export async function sendMessage(
  phoneNumber: string,
  code: string | undefined,
  message: string | null,
) {
  try {
    const Kavenegar = require("kavenegar");
    const api = Kavenegar.KavenegarApi({ apikey: process.env.SMS_API_KEY });

    if (code) {
      api.VerifyLookup(
        {
          receptor: phoneNumber,
          token: code,
          template: "user-otp",
        },
        (response: any, status: any) => {
          console.log("OTP Response:", response);
          console.log("OTP Status:", status);
        },
      );
    } else if (message) {
      api.VerifyLookup(
        {
          receptor: phoneNumber,
          token: message,
          template: "user-otp",
        },
        (response: any, status: any) => {
          console.log("OTP Response:", response);
          console.log("OTP Status:", status);
        },
      );
    } else {
      console.log("No code or message provided");
      return false;
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function sendOwnerEstateMessage(
  phoneNumber: string,
  estateCode: number,
  link: string,
) {
  const Kavenegar = require("kavenegar");
  const api = Kavenegar.KavenegarApi({ apikey: process.env.SMS_API_KEY });

  api.VerifyLookup(
    {
      receptor: phoneNumber,
      token20: estateCode,
      token: link,
      template: "sendowner-sms",
    },
    (response: any, status: any) => {
      console.log("OTP Response:", response);
      console.log("OTP Status:", status);
    },
  );
}
export async function sendClientSessionMessage(
  phoneNumber: string,
  firstName: string,
  title: string,
  link: string,
) {
  try {
    const Kavenegar = require("kavenegar");
    const api = Kavenegar.KavenegarApi({ apikey: process.env.SMS_API_KEY });
    api.VerifyLookup(
      {
        receptor: phoneNumber,
        token: firstName,
        token20: title,
        token10: link,
        template: "session-client",
      },
      (response: any, status: any) => {
        console.log("OTP Response:", response);
        console.log("OTP Status:", status);
      },
    );

    return { code: 1, message: "پیامک با موفقیت ارسال شد" };
  } catch (error) {
    return { code: 0, message: "خطایی در ارسال پیامک رخ داده است" };
  }
}
export async function sendAdminSessionMessage(
  phoneNumber: string,
  firstName: string,
  title: string,
  link: string,
) {
  const Kavenegar = require("kavenegar");
  const api = Kavenegar.KavenegarApi({ apikey: process.env.SMS_API_KEY });
  api.VerifyLookup(
    {
      receptor: phoneNumber,
      token: firstName,
      token20: title,
      token10: link,
      template: "session-admin",
    },
    (response: any, status: any) => {
      console.log("OTP Response:", response);
      console.log("OTP Status:", status);
    },
  );
}

export function checkExpiration(timestamp: number) {
  const newTimestamp = Date.now();

  if (newTimestamp - timestamp <= 120 * 1000) {
    return false;
  } else {
    return true;
  }
}
export async function createToken(
  payload: any,
  secret: string | undefined,
  expirIn: number,
) {
  try {
    if (!secret) {
      return null;
    }
    return jwt.sign(payload, secret, { expiresIn: expirIn });
  } catch (error) {
    return null;
  }
}
export async function validateToken(accessToken: string) {
  try {
    const accessTokenPrivate = process.env.ACCESS_TOKEN_PRIVATE_KEY;

    if (!accessTokenPrivate) {
      return { code: 0, message: "مشکلی پیش آمده است" };
    }

    const decode: any = jwt.verify(accessToken, accessTokenPrivate);

    const user = await prisma.user.findUnique({
      where: {
        id: decode.userId,
      },
    });

    if (!user) {
      return { code: 0, message: "کاربر یافت نشد" };
    }

    if (user.isActive == false) {
      return { code: 0, message: "حساب شما مسدود شده است" };
    }

    decode.accessPerms = user.accessPerms;

    if (!decode) {
      return { code: 0, message: "توکن نامعتبر است" };
    }

    return {
      code: 1,
      message: "توکن با موفقیت رمزگشایی شده است",
      data: decode,
    };
  } catch (error) {
    console.log(error);

    return { code: 0, message: "دسترسی منقضی شده است" };
  }
}

export async function validatePassToken(token: string) {
  try {
    const private_key = process.env.PASS_TOKEN_PRIVATE_KEY;

    if (!private_key) {
      return { code: 0, message: "کلید خصوصی یافت نشد" };
    }

    const decode = jwt.verify(token, private_key);

    return { code: 1, decode: decode };
  } catch (error) {
    return { code: 0, message: "توکن ثبت نام نامعتبر میباشد" };
  }
}

export function convertBigIntToString(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "bigint") return obj.toString();
  if (obj instanceof Date) return obj; // ✅ حفظ شیء تاریخ (خود به‌خود به ISO تبدیل می‌شود)
  if (Array.isArray(obj)) {
    return obj.map((item) => convertBigIntToString(item));
  }
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = convertBigIntToString(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

export function getDatewithOutTimeZone(date = new Date()) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  );
}

export async function checkUserPermission(
  path: string,
  accessPerms: FunctionalPermission[],
): Promise<{ code: 0 | 1; message: string }> {
  try {
    const newPath = path.split("?")[0];

    if (accessPerms.includes("SUPER_USER") || accessPerms.includes("OWNER")) {
      return { code: 1, message: "دسترسی مجاز است" };
    }

    const requiredPermissions = permissionMap[newPath];

    if (!requiredPermissions) {
      return { code: 1, message: "دسترسی مجاز است" };
    }

    const hasPermission = requiredPermissions.some((p) =>
      accessPerms.includes(p),
    );

    if (!hasPermission) {
      return { code: 0, message: "دسترسی مجاز نیست" };
    }

    return { code: 1, message: "دسترسی مجاز است" };
  } catch {
    return { code: 0, message: "خطا در بررسی دسترسی" };
  }
}
