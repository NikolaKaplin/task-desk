"use client";

import { UserRole } from "@prisma/client";
import { useUser } from "./user-provider";
import { useEffect } from "react";

export function RoleHidden(props: {
  children: React.ReactNode;
  roles?: UserRole[];
  role?: UserRole;
}) {
  const roles: UserRole[] = props.roles ?? (props.role ? [props.role] : []);
  if (roles.length == 0) return props.children;
  const user = useUser();

  if (!user) return <></>;
  if (roles.includes(user.role)) return <></>;
  return props.children;
}
