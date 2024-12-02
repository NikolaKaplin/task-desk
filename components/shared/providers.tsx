"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "./navbar";
import { Toaster } from "../ui/toaster";
import { UserProvider } from "../utils/user-provider";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <UserProvider>
        <Navbar>
          <main className="flex-1">
            {children}
            <Toaster />
          </main>
        </Navbar>
      </UserProvider>
    </SessionProvider>
  );
};
