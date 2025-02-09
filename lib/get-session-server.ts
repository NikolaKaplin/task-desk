"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/db";
import { userTable } from "@/db/schema";
import { getServerSession } from "next-auth";
import { eq } from "drizzle-orm";

export async function getUserSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return undefined;

  const [user] = await db
    .selectDistinct()
    .from(userTable)
    .where(eq(userTable.id, session.user.id));

  return user;
}
