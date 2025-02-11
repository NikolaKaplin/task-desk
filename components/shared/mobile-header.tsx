import type React from "react";
import { CodeXml } from "lucide-react";
import Link from "next/link";
import Hamburger from "hamburger-react";

interface MobileHeaderProps {
  teamName: string;
  onMenuClick: () => void;
  isMobileMenuOpen: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  teamName,
  onMenuClick,
  isMobileMenuOpen,
}) => {
  return (
    <header className="bg-gray-800 p-2 flex items-center justify-between lg:hidden">
      <div className="w-7"></div>
      <Link
        href="/"
        className="flex items-center space-x-2 absolute left-1/2 transform -translate-x-1/2"
      >
        <CodeXml size={40} className="text-indigo-400" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
          {teamName}
        </h1>
      </Link>
      <div className="flex items-center">
        <Hamburger
          color="#818cf8"
          direction="right"
          size={24}
          toggled={isMobileMenuOpen}
          toggle={onMenuClick}
          duration={0.3}
        />
      </div>
    </header>
  );
};
