// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';
// import * as UserDTOs from './users.dto'

// @Injectable()
// export class UsersService {
//   constructor(private prisma: PrismaService) {}

//   async createUserServie(data: UserDTOs.CreateUserDto) {
//     try {
//       const existuser = await this.prisma.user.findUnique({
//         where: {
//           phoneNumber: data.phoneNumber,
//         },
//       });
//       if (existuser) {
//         return {
//           code: 0,
//           message: 'این کاربر وجود دارد',
//         };
//       }

//       const newUser = await this.prisma.user.create({
//         data: {
//           firstName: data.firstName,
//           lastName: data.lastName,
//           phoneNumber: data.phoneNumber,
//         },
//       });

//       return {
//         code: 1,
//         message: 'کاربر ایجاد شد',
//         userId: newUser.id,
//       };
//     } catch (error) {
//       console.log(error);
//       return { code: 0, message: 'اطلاعات ارسالی نامعتبر است' };
//     }
//   }

//   async getUsersServie() {
//     try {
//       const data = await this.prisma.user.findMany();
//       return {
//         code: 1,
//         message: 'اطلاعات با موفقیت ارسال شد',
//         data: data,
//       };
//     } catch (error) {
//       console.log(error);
//       return { code: 0, message: 'اطلاعات ارسالی نامعتبر است' };
//     }
//   }

//   async updateUserServie(id: string, data: UserDTOs.UpdateUserDto) {
//     try {
//       const user = await this.prisma.user.findUnique({
//         where: { id },
//       });

//       if (!user) {
//         return { code: 0, message: 'کاربر یافت نشد' };
//       }

//       await this.prisma.user.update({
//         where: { id },
//         data: data,
//       });

//       return {
//         code: 1,
//         message: 'اطلاعات کاربر با موفقیت بروزرسانی شد',
//       };
//     } catch (error) {
//       console.log(error);
//       return { code: 0, message: 'اطلاعات ارسالی نامعتبر است' };
//     }
//   }
// }
