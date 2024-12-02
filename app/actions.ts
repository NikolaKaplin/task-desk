"use server";

import { prisma } from "@/prisma/prisma-client";
import { hashSync } from "bcryptjs";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";

export async function registerUser(
  body: Prisma.UserCreateInput
): Promise<RegisterResult> {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      return { success: false };
    } else {
      const createdUser = await prisma.user.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          password: hashSync(body.password, 10),
        },
      });
      return { success: !!createdUser };
    }
  } catch (err) {
    return { success: false };
  }
}

export async function Applications() {
  try {
    const usersWithRoleUser = await prisma.user.findMany({
      where: {
        role: {
          equals: "UNVERIFIED",
        },
      },
    });
    return usersWithRoleUser;
  } catch (err) {
    console.error(err);
  }
}

export async function confirmUser(
  body: Prisma.UserUpdateInput,
  isDelete: boolean
) {
  if (isDelete) {
    await prisma.user.delete({
      where: {
        email: body.email as string,
      },
    });
  } else {
    await prisma.user.update({
      where: {
        email: body.email as string,
      },
      data: {
        role: "USER",
      },
    });
  }
}

type RegisterResult = {
  success: boolean;
};

export async function countUnverifiedUsers() {
  const usersWithRoleUser = await prisma.user.count({
    where: {
      role: {
        equals: "UNVERIFIED",
      },
    },
  });
  return usersWithRoleUser;
}
