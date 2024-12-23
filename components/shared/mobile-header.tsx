"use client";

import React from "react";
import { AlignJustify, Menu } from "lucide-react";
import { Button } from "../ui/button";

interface MobileHeaderProps {
  teamName: string;
  onMenuClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  teamName,
  onMenuClick,
}) => {
  return (
    <header className="flex items-center justify-between p-4 bg-stone-800 text-white lg:hidden">
      <h1 className="text-xl font-bold">{teamName}</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <AlignJustify className="h-6 w-6" />
      </Button>
    </header>
  );
};
