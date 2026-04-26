import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { FunctionalPermission } from '@prisma/client';
import {
  buildSearchCondition,
  getAllParents,
  sendOwnerEstateMessage,
} from 'src/utils/module';

@Injectable()
export class ManagementService {
  constructor(private prisma: PrismaService) {}

  async getUserListService(
    role?: any,
    page?: number,
    limit?: number,
    search?: string,
  ) {
    try {
      const currentPage = page && page > 0 ? page : 1;
      const perPage = limit && limit > 0 ? limit : 10;

      let accessPermsCondition = {};
      if (role === 'OTHER') {
        accessPermsCondition = { NOT: { accessPerms: { has: 'USER' } } };
      } else if (role == 'USER') {
        accessPermsCondition = { accessPerms: { has: 'USER' } };
      }

      const searchCondition =
        search && search.trim() !== '' ? buildSearchCondition(search) : {};

      const whereCondition: any = {
        ...accessPermsCondition,
        ...searchCondition,
      };

      const [users, totalCount] = await Promise.all([
        this.prisma.user.findMany({
          where: whereCondition,
          skip: (currentPage - 1) * perPage,
          take: perPage,
          orderBy: { updatedAt: 'desc' },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
            isActive: true,
            createdAt: true,
            accessPerms: true,
            avatar: true,
            _count: { select: { createdEstates: true } },
          },
        }),
        this.prisma.user.count({ where: whereCondition }),
      ]);

      return {
        code: 1,
        message: 'اطلاعات با موفقیت ارسال شد',
        data: {
          users,
          pagination: {
            total: totalCount,
            page: currentPage,
            limit: perPage,
            totalPages: Math.ceil(totalCount / perPage),
          },
        },
      };
    } catch (error) {
      return { code: 0, message: 'اطلاعات ارسالی نامعتبر است' };
    }
  }

  async getUserInformationService(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          phoneNumber: true,
          fixPhoneNumber: true,
          address: true,
          education: true,
          email: true,
          birthdate: true,
          isActive: true,
          createdAt: true,
          avatar: true,
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phoneNumber: true,
            },
          },
        },
      });

      if (!user) return { code: 0, message: 'آیدی ارسال شده نامعتبر است' };
      return { code: 1, message: 'اطلاعات با موفقیت ارسال شد', data: user };
    } catch (error) {
      return { code: 0, message: 'اطلاعات ارسالی نامعتبر است' };
    }
  }

  async editUserPermissionService(
    editorId: string,
    userId: string,
    category: any[],
    accessPerms: any[],
  ) {
    try {
      const editor = await this.prisma.user.findUnique({
        where: { id: editorId },
      });
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { userPermission: { include: { category: true } } },
      });

      if (!user || !editor)
        return { code: 0, message: 'آیدی ارسال شده نامعتبر است' };
      if (editorId === userId)
        return { code: 0, message: 'نمیتوانید دسترسی خود را ویرایش کنید' };

      if (
        !editor.accessPerms.includes('OWNER') &&
        (user.accessPerms.includes('SUPER_USER') ||
          user.accessPerms.includes('OWNER'))
      ) {
        return {
          code: 0,
          message: 'نمیتوانید اطلاعات مالک یا سوپریوزر را ویرایش کنید',
        };
      }

      const finalAccessPerms =
        Array.isArray(accessPerms) && accessPerms.length > 0
          ? accessPerms
          : ['USER'];
      const oldAccessPerms = user.accessPerms;

      await this.prisma.$transaction(async (tx) => {
        await tx.user.update({
          where: { id: userId },
          data: { accessPerms: { set: finalAccessPerms } },
        });

        if (user.userPermission) {
          await tx.userPermission.update({
            where: { id: user.userPermission.id },
            data: {
              category: { set: category.map((cat) => ({ id: cat.id })) },
            },
          });
        } else {
          await tx.userPermission.create({
            data: {
              user: { connect: { id: userId } },
              category: { connect: category.map((cat) => ({ id: cat.id })) },
            },
          });
        }
      });

      // Logging logic
      const changes: any = { oldData: {}, newData: {} };
      if (JSON.stringify(oldAccessPerms) !== JSON.stringify(finalAccessPerms)) {
        changes.oldData['سطح دسترسی'] = oldAccessPerms.join(', ');
        changes.newData['سطح دسترسی'] = finalAccessPerms.join(', ');
      }

      if (Object.keys(changes.newData).length > 0) {
        await this.prisma.log.create({
          data: {
            actionType: 'UPDATE',
            modelName: 'USER_PERMISSION',
            contentId: userId,
            createdById: editorId,
            createdForId: userId,
            description: [
              {
                changes,
                message: `کاربر ${editor.firstName} ${editor.lastName} سطوح دسترسی کاربر ${user.firstName} ${user.lastName} را تغییر داد.`,
              },
            ],
          },
        });
      }
      return { code: 1, message: 'اطلاعات با موفقیت ذخیره شد' };
    } catch (e) {
      return { code: 0, message: 'اطلاعات ارسالی نامعتبر است' };
    }
  }

  async editUserProfileService(
    editorId: string,
    userId: string,
    firstName: string,
    lastName: string,
    birthdate: string | undefined,
    phoneNumber: string,
    address: string | undefined,
    education: string | undefined,
    fixPhoneNumber: string | undefined,
    email: string | undefined,
    avatar: any,
  ) {
    try {
      const editor = await this.prisma.user.findUnique({
        where: { id: editorId },
      });
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user || !editor)
        return { code: 0, message: 'آیدی ارسال شده نامعتبر است' };
      if (
        !editor.accessPerms.includes('OWNER') &&
        userId !== editor.id &&
        (user.accessPerms.includes('SUPER_USER') ||
          user.accessPerms.includes('OWNER'))
      ) {
        return {
          code: 0,
          message: 'نمیتوانید اطلاعات سوپریوزر یا مالک را ویرایش کنید',
        };
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          phoneNumber,
          address,
          education,
          fixPhoneNumber,
          email: email == undefined ? undefined : email,
          birthdate,
          avatar,
        },
      });
      return { code: 1, message: 'اطلاعات با موفقیت ذخیره شد' };
    } catch (e) {
      return { code: 0, message: 'اطلاعات ارسالی نامعتبر است' };
    }
  }

  async editUserStatusService(editorId: string, userId: string, status: boolean) {
    try {
      if (editorId === userId)
        return { code: 0, message: 'نمیتوانید خودتان را غیر فعال کنید' };
      const editor = await this.prisma.user.findUnique({
        where: { id: editorId },
      });
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user || !editor) return { code: 0, message: 'کاربر یافت نشد' };
      if (
        !editor.accessPerms.includes('OWNER') &&
        (user.accessPerms.includes('SUPER_USER') ||
          user.accessPerms.includes('OWNER'))
      ) {
        return {
          code: 0,
          message: 'نمیتوانید اطلاعات سوپریوزر یا مالک را ویرایش کنید',
        };
      }

      await this.prisma.user.update({
        where: { id: userId },
        data: { isActive: status },
      });
      return { code: 1, message: 'وضعیت کاربر با موفقیت تغییر کرد' };
    } catch (e) {
      return { code: 0, message: 'اطلاعات ارسالی نامعتبر است' };
    }
  }

  async getPersonalInformationService(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          userPermission: {
            include: {
              category: { select: { id: true, name: true, parentId: true } },
            },
          },
        },
      });
      if (!user) return { code: 0, message: 'آیدی ارسال شده نامعتبر است' };

      if (user.userPermission?.category) {
        for (const cat of user.userPermission.category) {
          (cat as any).parents = await getAllParents(cat.id);
        }
      }
      return { code: 1, message: 'اطلاعات با موفقیت ارسال شد', data: user };
    } catch (e) {
      return { code: 0, message: 'خطا در دریافت اطلاعات' };
    }
  }

  async getUserListWithAccessService(
    page?: number,
    limit?: number,
    search?: string,
    access?: FunctionalPermission,
  ) {
    try {
      const currentPage = page && page > 0 ? page : 1;
      const perPage = limit && limit > 0 ? limit : 10;

      const skip = (currentPage - 1) * perPage;
      const where: any = {};
      if (access) where.accessPerms = { has: access };
      if (search?.trim()) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
        ];
      }
      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          skip,
          take: limit,
          orderBy: { updatedAt: 'desc' },
        }),
        this.prisma.user.count({ where }),
      ]);
      return {
        code: 1,
        message: 'اطلاعات با موفقیت ارسال شد',
        data: {
          users,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / perPage),
          },
        },
      };
    } catch (e) {
      return { code: 0, message: 'اطلاعات ارسالی نامعتبر است' };
    }
  }

  async messageSenderService(userId: string, entityId: string, type: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!user) return { code: 0, message: 'آیدی ارسال شده نامعتبر است' };

      if (type === 'OWNER') {
        const estate = await this.prisma.estate.findUnique({
          where: { id: entityId },
        });
        if (!estate) return { code: 0, message: 'آیدی ملک نامعتبر است' };
        await sendOwnerEstateMessage(
          user.phoneNumber,
          estate.estateCode,
          `https://www.azarmelk.com/estates/${estate.id}`,
        );
      }
      return { code: 1, message: 'پیام با موفقیت ارسال شد' };
    } catch (e) {
      return { code: 0, message: 'اطلاعات ارسالی نامعتبر است' };
    }
  }
}
