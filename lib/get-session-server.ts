"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/prisma/prisma-client";
import { getServerSession } from "next-auth";

export async function getUserSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return undefined;

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  return user;
}
