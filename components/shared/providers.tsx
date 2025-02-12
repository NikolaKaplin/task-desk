"use client";
import type React from "react";
import { SessionProvider } from "next-auth/react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Toaster } from "../ui/toaster";
import { UserProvider } from "../utils/user-provider";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <UserProvider>
        <Navbar>
          {children}
          <Toaster />
        </Navbar>
      </UserProvider>
    </SessionProvider>
  );
};
