"use client";
import { CodeXml, LogOut } from "lucide-react";
import React from "react";
import { navItems } from "@/app/constants";
import { Title } from "./title";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import NavbarItem from "./navbar-item";
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

  return (
    <div className="flex">
      <div className="flex max-h-screen min-h-screen">
        <div className="flex flex-col w-full max-h-full bg-stone-800 text-white">
          <Title
            icon={<CodeXml size={50} />}
            className=" text-center p-5"
            size="xl"
            text="Altergemu"
          />
          <div
            className="flex flex-col grow max-h-full overflow-y-scroll"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#292524 #292524",
            }}
          >
            {navItems.map(({ title, icon, path, hiddenFor }, index, item) => (
              <NavbarItem
                key={index}
                item={item[index]}
                pathName={pathName}
                indicatorVersion={indicatorsVersion}
              ></NavbarItem>
            ))}
            <div className="grow"></div>
            <div className="flex justify-end">
              <Button
                className=" border border-primary bg-transparent max-w-fit items-center gap-4 m-2 p-4 cursor-pointer rounded-2xl text-primary-foreground hover:bg-stone-700 hover:text-red-500"
                onClick={() => signOut()}
              >
                <LogOut />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <IndicatorsVersionContext.Provider
        value={{
          version: indicatorsVersion,
          update: () => setIndicatorsVersion((v) => v + 1),
        }}
      >
        {children}
      </IndicatorsVersionContext.Provider>
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
