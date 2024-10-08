import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlignJustify, Paperclip, MessageCircle } from "lucide-react";
import { Check } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

export default function CompletedCard() {
  return (
    <div className="mt-7">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Task</CardTitle>
          <CardDescription>Install engine UE5-4</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5"></div>
              <div className="flex flex-col space-y-1.5"></div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Check className=" text-green-500" />
          <div className="flex justify-start">
            <Avatar>
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/148112261?v=4"
                className="w-10 h-10 rounded-full"
              />
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/160280854?v=4"
                className="w-10 h-10 rounded-full"
              />
            </Avatar>
            <Avatar>
              <AvatarImage
                src="https://avatars.githubusercontent.com/u/94832648?v=4"
                className="w-10 h-10 rounded-full"
              />
            </Avatar>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
