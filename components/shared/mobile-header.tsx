import { Button } from "../ui/button";
import { Menu, CodeXml } from "lucide-react";
import Link from "next/link";

interface MobileHeaderProps {
  teamName: string;
  onMenuClick: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  teamName,
  onMenuClick,
}) => {
  return (
    <header className="bg-gray-800 p-4 flex items-center justify-between lg:hidden">
      <Link href="/" className="flex items-center space-x-2">
        <CodeXml size={28} className="text-indigo-400" />
        <h1 className="text-xl  font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-600">
          {teamName}
        </h1>
      </Link>
      <Button
        variant={"link"}
        className=" bg-gray-800 text-white"
        size="icon"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </Button>
    </header>
  );
};
