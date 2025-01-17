"use client";

import { CircleUserRound, CodeXml, LoaderCircle, LogOut } from "lucide-react";
import React, { useState } from "react";
import { navItems } from "@/app/constants";
import { Title } from "./title";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import NavbarItem from "./navbar-item";
import { AvatarImage } from "../ui/avatar";
import { Avatar } from "@radix-ui/react-avatar";
import { MobileHeader } from "./mobile-header";
import Link from "next/link";

interface Props {
  SetNumber?: number;
  className?: string;
  children: React.ReactNode;
  hidden?: boolean;
}

export const Navbar: React.FC<Props> = ({
  SetNumber,
  className,
  children,
  hidden,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  let pathName = usePathname();
  console.log(pathName);
  if (pathName == "/") {
    pathName = "home";
  }
  if (
    pathName == "/register" ||
    pathName == "/login" ||
    pathName == "/register/confirm"
  ) {
    return children;
  }
  const [indicatorsVersion, setIndicatorsVersion] = React.useState(0);
  const { data: session, status } = useSession();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <MobileHeader teamName="Altergemu" onMenuClick={toggleMobileMenu} />
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition duration-200 ease-in-out flex flex-col w-64 bg-stone-800 text-white z-30`}
      >
        <div className="flex-grow overflow-y-auto">
          <Title
            icon={<CodeXml size={50} />}
            className="text-center p-5 hidden lg:block"
            size="xl"
            text="Altergemu"
          />
          <nav>
            {navItems.map(({ title, icon, path, hiddenFor }, index, item) => (
              <NavbarItem
                key={index}
                item={item[index]}
                pathName={pathName}
                indicatorVersion={indicatorsVersion}
              />
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-stone-700">
          {status === "loading" ? (
            <div className="flex justify-center">
              <LoaderCircle className="animate-spin" />
            </div>
          ) : session?.user ? (
            <div className="flex items-center justify-between">
              <Link href="/profile" className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 rounded-sm">
                  <AvatarImage
                  className=" rounded-[50%]"
                    src={session.user.avatar || undefined}
                    alt={session.user.name || "User avatar"}
                  />
                </Avatar>
                <span className="text-sm font-medium">{session.user.name}</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="text-primary-foreground hover:bg-stone-700 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="ml-0 lg:ml-64 flex-grow overflow-y-auto">
        <IndicatorsVersionContext.Provider
          value={{
            version: indicatorsVersion,
            update: () => setIndicatorsVersion((v) => v + 1),
          }}
        >
          {children}
        </IndicatorsVersionContext.Provider>
      </div>
    </div>
  );
};

type IndicatorVersion = {
  update: () => void;
  version: number;
};

const IndicatorsVersionContext = React.createContext<IndicatorVersion>({
  version: 0,
  update() {},
});

export function useIndicatorsVersion() {
  return React.useContext(IndicatorsVersionContext);
}

export function useIndicatorsVersionUpdater() {
  return React.useContext(IndicatorsVersionContext).update;
}
