"use client";

import { useUser } from "./user-provider";

export function RoleHidden(props: {
  children: React.ReactNode;
  roles?: string[];
  role?: string;
}) {
  const roles: string[] = props.roles ?? (props.role ? [props.role] : []);
  if (roles.length == 0) return props.children;
  const user = useUser();

  if (!user) return <></>;
  if (roles.includes(user.role)) return <></>;
  return props.children;
}
