"use server";

import { prisma } from "@/prisma/prisma-client";
import { hashSync } from "bcryptjs";
import { cookies } from "next/headers";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { writeFile } from 'fs/promises'
import path from 'path'

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
          bio: ""
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

export async function updateProfile(
  body: Prisma.UserUncheckedUpdateInput
): Promise<ProfileEdited> {
  try {
    await prisma.user.update({
      where: {
        id: body.id as number,
      },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
      },
    });
    return { edit: true };
  } catch (err) {
    console.error(err);
    return { edit: false };
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

type ProfileEdited = {
  edit: boolean;
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




export async function updateProfileUser(data: {
  name: string;
  email: string;
  bio: string;
}) {
  // This is a mock function. In a real application, you would update the user's profile in the database.
  console.log("Updating profile:", data);

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Revalidate the profile page
  revalidatePath("/profile");

  // Return a mock result
  return { success: true };
}

export async function setUserAvatar(userId: number, avatar: string) {
  const response  = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      avatar: avatar
    }
  })
  return response;
}
