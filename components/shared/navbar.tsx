"use client";

import {
  AlertTriangle,
  Check,
  CodeXml,
  DoorOpen,
  LoaderCircle,
  LogOut,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { navItems } from "@/app/constants";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { signOut, useSession } from "next-auth/react";
import NavbarItem from "./navbar-item";
import { AvatarImage } from "../ui/avatar";
import { Avatar } from "@radix-ui/react-avatar";
import { MobileHeader } from "./mobile-header";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Footer } from "./footer";

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
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [indicatorsVersion, setIndicatorsVersion] = React.useState(0); // Moved useState call outside conditional
  const { data: session, status } = useSession();
  let pathName = usePathname();
  if (pathName == "/") {
    pathName = "home";
  }
  if (pathName == "/login" || pathName == "/login/confirm") {
    return children;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    setIsLogoutDialogOpen(true);
  };

  const confirmLogout = () => {
    signOut();
    setIsLogoutDialogOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <MobileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        teamName="Altergemu"
        onMenuClick={toggleMobileMenu}
      />
      <div
        className={`fixed rounded-r-3xl inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition duration-300 ease-in-out flex flex-col w-64 bg-gray-800 text-white z-30 shadow-lg`}
      >
        <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          <div className="text-center p-6 hidden lg:block">
            <div className="flex items-center justify-center space-x-2">
              <img
                src="https://img.icons8.com/?size=64&id=79043&format=png"
                alt=""
              />
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-500">
                Altergemu
              </h1>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Software & Game Dev
            </div>
          </div>
          <nav className="space-y-1 py-2 px-3">
            {navItems.map(({ title, icon, path, hiddenFor }, index, item) => (
              <NavbarItem
                key={index}
                item={item[index]}
                pathName={pathName}
                indicatorVersion={indicatorsVersion}
                closeMobileMenu={closeMobileMenu}
              />
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
              <Link
                href="/profile"
                className="flex items-center space-x-3 group"
              >
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
              <AlertDialog
                open={isLogoutDialogOpen}
                onOpenChange={setIsLogoutDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-indigo-400 hover:bg-transparent hover:text-indigo-400"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-gray-800 border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-green-500 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Are you sure you want to log out?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-gray-400">
                      This action will end your current development session.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-gray-700 text-green-500 hover:bg-gray-600 hover:text-green-400 border-gray-600">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={confirmLogout}
                      className="bg-green-600 text-gray-100 hover:bg-green-700"
                    >
                      <DoorOpen className="h-4 w-4 mr-2" />
                      Log out
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex-1 overflow-hidden" onClick={closeMobileMenu}>
        <div className="h-screen overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-800 text-gray-900 dark:text-gray-100">
          <IndicatorsVersionContext.Provider
            value={{
              version: indicatorsVersion,
              update: () => setIndicatorsVersion((v) => v + 1),
            }}
          >
            <div className=" flex flex-col min-h-screen pt-20 lg:pt-4 lg:pl-64">
              <div className="flex-grow">{children}</div>
              <Footer />
            </div>
          </IndicatorsVersionContext.Provider>
        </div>
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
