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
import { AlignJustify, Paperclip } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

export default function ProcessedCard() {
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
          <div className="flex justify-start">
            <Button variant="outline" className="ml-5 ">
              <AlignJustify />
            </Button>
            <Button variant="outline" className="ml-5 ">
              <Paperclip />
            </Button>
          </div>
          <div className="flex justify-end"></div>
        </CardFooter>
      </Card>
    </div>
  );
}
