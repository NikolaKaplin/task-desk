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
    pathName == "/login" ||
    pathName == "/login/confirm"
  ) {
    return children;
  }
  const [indicatorsVersion, setIndicatorsVersion] = React.useState(0);
  const { data: session, status } = useSession();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <MobileHeader teamName="Altergemu" onMenuClick={toggleMobileMenu} />
      <div
        className={`fixed rounded-r-3xl inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition duration-300 ease-in-out flex flex-col w-64 bg-gray-800 text-white z-30 shadow-lg`}
      >
         <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
         <div className="text-center p-6 lg:block">
            <div className="flex items-center justify-center space-x-2">
              <CodeXml size={40} className="text-indigo-400" />
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
                Altergemu
              </h1>
            </div>
            <div className="mt-2 text-sm text-gray-400">Software & Game Dev</div>
          </div>
          <nav className="space-y-1 px-3">
            {navItems.map(({ title, icon, path, hiddenFor }, index, item) => (
              <NavbarItem key={index} item={item[index]} pathName={pathName} indicatorVersion={indicatorsVersion} closeMobileMenu={closeMobileMenu} />
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-700">
          {status === "loading" ? (
            <div className="flex justify-center">
              <LoaderCircle className="animate-spin text-indigo-400" />
            </div>
          ) : session?.user ? (
            <div className="flex items-center justify-between">
              <Link href="/profile" className="flex items-center space-x-3 group">
                <Avatar className="h-10 w-10 rounded-full ring-2 ring-indigo-400 transition-all duration-300 group-hover:ring-indigo-300">
                  <AvatarImage
                    className="rounded-full"
                    src={session.user.avatar || undefined}
                    alt={session.user.name || "User avatar"}
                  />
                </Avatar>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                  {session.user.name}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="text-gray-400 hover:bg-gray-700 hover:text-red-400 transition-colors duration-300"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      <div className="w-64 bg-gray-800 border-gray-700"></div>
      <div className="flex-1 overflow-hidden" onClick={closeMobileMenu}>
        <div className="h-screen overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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
    </div>
  )
}

type IndicatorVersion = {
  update: () => void
  version: number
}

const IndicatorsVersionContext = React.createContext<IndicatorVersion>({
  version: 0,
  update() {},
})

export function useIndicatorsVersion() {
  return React.useContext(IndicatorsVersionContext)
}

export function useIndicatorsVersionUpdater() {
  return React.useContext(IndicatorsVersionContext).update
}