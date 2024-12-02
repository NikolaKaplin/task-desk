"use client";
import clsx from "clsx";
import { Icon } from "lucide-react";
import React from "react";

type TitleSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface Props {
  size?: TitleSize;
  className?: string;
  text: string;
  icon?: JSX.Element;
}

export const Title: React.FC<Props> = ({
  icon,
  text,
  size = "sm",
  className,
}) => {
  const maptagBySize = {
    xs: "h5",
    sm: "h4",
    md: "h3",
    lg: "h2",
    xl: "h1",
    "2xl": "h1",
  } as const;

  const mapClassNameBySize = {
    xs: "text-[16px]",
    sm: "text-[22px]",
    md: "text-[26px]",
    lg: "text-[32px]",
    xl: "text-[40px]",
    "2xl": "text-[46px]",
  } as const;

  return React.createElement(
    maptagBySize[size],
    { className: clsx(mapClassNameBySize[size], className) },
    <div className="flex items-center justify-center">
      {icon}
      {text}
    </div>
  );
};
