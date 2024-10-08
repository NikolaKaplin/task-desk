import TaskCard from "@/components/shared/toComplitionCard";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToCompletion from "@/components/shared/toCompletion";
import Processed from "@/components/shared/processed";
import Completed from "@/components/shared/comleted";
import { Header } from "@/components/shared/header";

export default function Home() {
  return (
    <div className=" bg-cover bg-gradient-to-tl from-indigo-500 to-green-300 min-h-screen min-w-screen">
      <Header />
      <div className="flex mt-10 justify-around size-full ">
        <ToCompletion />
        <Processed />
        <Completed />
      </div>
    </div>
  );
}
