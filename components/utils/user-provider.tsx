"use client";

import { getUserSession } from "@/lib/get-session-server";

import { User } from "@prisma/client";
import React from "react";

export type ClientSafeUser = {
  id: User["id"];
  firstName: User["firstName"];
  lastName: User["lastName"];
  role: User["role"];
};

const Context = React.createContext<ClientSafeUser | undefined>(undefined);

export function useUser() {
  return React.useContext(Context);
}

export function UserProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<ClientSafeUser>();

  React.useEffect(() => {
    (async () => {
      const u = await getUserSession();
      if (u)
        setUser({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role,
        });
    })();
  }, []);

  return <Context.Provider value={user}>{props.children}</Context.Provider>;
}
