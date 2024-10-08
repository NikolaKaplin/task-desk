import { cn } from "@/lib/utils";
import React from "react";
import { Container } from "./container";
import { Button } from "../ui/button";
import { ArrowRight, ShoppingCart, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

interface Props {
  className?: string;
}

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn("border border-b", className)}>
      <div className=" pt-2 pb-2">
        <Container className="flex justify-between items-center py=8">
          {/*Левая часть*/}
          <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold">Task Manager ALTERGEMU</h3>
          </div>
          {/*Правая часть*/}
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/148112261?v=4"
                className=" w-20 h-20 rounded-full "
              />
            </Avatar>
            <div className=" justify-center">
              <h3 className="text-2xl font-bold">Николай Каплин</h3>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};
