import { Providers } from "@/components/shared/providers";
import { getUserSession } from "@/lib/get-session-server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout(props: { children: ReactNode }) {
  const user = await getUserSession();
  if (!user) redirect("/login");
  if (user.role == "UNVERIFIED") redirect("/login/confirm");

  return <Providers>{props.children}</Providers>;
}
