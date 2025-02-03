"use client";

import Link from "next/link";
import { RoleHidden } from "../utils/role-hidden";
import type { NavItems } from "@/app/types";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { useIndicatorsVersion } from "./navbar";
import { motion } from "framer-motion";

interface NavbarItemProps {
  item: NavItems;
  pathName: string;
  indicatorVersion: number;
  closeMobileMenu: () => void;
}

export default function NavbarItem({
  item: { title, icon, path, hiddenFor, indicatorHandler },
  pathName,
  indicatorVersion: indicatorsVersion,
  closeMobileMenu,
}: NavbarItemProps) {
  const [count, setCount] = React.useState(0);
  useEffect(() => {
    indicatorHandler?.().then((res) => setCount(res));
  }, [indicatorHandler]);

  const isActive = pathName.includes(path);
  const absolutePath = path.startsWith("/") ? path : `/${path}`;
  const handleClick = () => {
    closeMobileMenu();
  };

  return (
    <RoleHidden roles={hiddenFor}>
      <Link
        href={absolutePath === "/home" ? "/" : absolutePath}
        onClick={handleClick}
      >
        <motion.div
          className={cn(
            "flex items-center gap-3 m-1 px-3 py-2 cursor-pointer rounded-lg transition-all duration-200",
            isActive
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-xl text-indigo-400">{icon}</span>
          <span className="font-medium text-sm">{title}</span>
          {count > 0 && (
            <div className="ml-auto bg-red-500 h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
              {count}
            </div>
          )}
          {isActive && (
            <motion.div
              className="ml-auto h-2 w-2 rounded-full bg-white shadow-sm"
              layoutId="activeIndicator"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>
      </Link>
    </RoleHidden>
  );
}
