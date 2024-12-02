"use client";
import Link from "next/link";
import { RoleHidden } from "../utils/role-hidden";
import { NavItems } from "@/app/types";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { useIndicatorsVersion } from "./navbar";

export default function NavbarItem({
  item: { title, icon, path, hiddenFor, indicatorHandler },
  pathName,
  indicatorVersion: indicatorsVersion,
}: {
  item: NavItems;
  pathName: string;
  indicatorVersion: number;
}) {
  const [count, setCount] = React.useState(0);
  useEffect(() => {
    indicatorHandler?.().then((res) => setCount(res));
  }, [indicatorHandler, pathName, indicatorsVersion]);
  return (
    <>
      <RoleHidden roles={hiddenFor}>
        <Link
          href={path.includes("home") ? "/" : path}
          className={cn(
            "flex items-center gap-4 m-2 p-4 cursor-pointer rounded-2xl hover:bg-stone-700",
            pathName.includes(path) ? "bg-stone-700" : ""
          )}
        >
          {icon}
          {title}
          {count > 0 && (
            <div className="bg-red-500 max-h-6 w-6  rounded-full flex items-center justify-center ">
              <span>{count}</span>
            </div>
          )}
        </Link>
      </RoleHidden>
    </>
  );
}
