import React from "react";
import { FaTelegram, FaDiscord, FaYoutube } from "react-icons/fa6";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-t from-gray-900 to-gray-800 py-8 text-gray-300">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h3 className="text-lg font-semibold">Join Our Community</h3>
          <p className="text-sm max-w-md text-center">
            Stay connected with us through our social media channels and be a part of the Altergemu family!
          </p>
          <div className="flex space-x-4">
            <SocialIcon
              href="https://t.me/rizoheisenbergg" 
              icon={<FaTelegram className="text-[#0088cc] hover:text-white transition duration-200" />}
              label="Telegram"
            />
            <SocialIcon
              href="https://discord.gg/wsHUFYTh" 
              icon={<FaDiscord className="text-[#7289d9] hover:text-white transition duration-200" />}
              label="Discord"
            />
            <SocialIcon
              href="https://youtube.com/yourchannel" 
              icon={<FaYoutube className="text-[#ff0000] hover:text-white transition duration-200" />}
              label="YouTube"
            />
          </div>
          <div className="mt-4 text-xs">
            © {new Date().getFullYear()} Altergemu - All Rights Reserved
          </div>
          <p className="text-xs text-gray-500">Made with ❤️ by Rizo</p>
        </div>
      </div>
    </footer>
  );
}

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ href, icon, label }) => {
  return (
    <Link href={href} passHref>
      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 transition duration-200 ease-in-out cursor-pointer">
        {React.cloneElement(icon as React.ReactElement, { size: 24 })}
        <span className="sr-only">{label}</span>
      </span>
    </Link>
  );
}