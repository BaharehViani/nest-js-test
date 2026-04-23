import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { FunctionalPermission } from "@prisma/client";

const prisma = new PrismaClient();

export const seedUsers = async () => {
  const user = await prisma.user.findFirst();

  if(user){
    return;
  }

  const hashedPassword = await bcrypt.hash("123456", 10);

  const users = [
    {
      firstName: "بهاره",
      lastName: "ویانی",
      phoneNumber: "09358600347",
      accessPerms: [FunctionalPermission.OWNER],
    },
    {
      firstName : "آیدین",
      lastName : "ظریفی",
      phoneNumber : "09391421581",
      accessPerms: [FunctionalPermission.SUPER_USER],

    },
    {
      firstName: "مرصاد",
      lastName: "حبیبی",
      phoneNumber: "09938461329",
      accessPerms: [FunctionalPermission.SUPER_USER],
    },
    {
      firstName: "سجاد",
      lastName: "زحمت کش",
      phoneNumber: "09146940677",
      accessPerms: [FunctionalPermission.SUPER_USER],
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
        isActive: true,
      },
    });
  }

  console.log('Seeded users');
};
