import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TaskCard from "@/components/shared/toComplitionCard";
import CompletedCard from "./completedCard";

export default function Completed() {
  return (
    <div className="h-2/3 w-3/12  bg-gray-100 rounded-2xl">
      <div className="grid mb-5 place-items-center">
        <h3 className=" pt-5 text-2xl text-center font-bold">Выполнено</h3>
        <div className="grid place-items-center">
          <CompletedCard />
        </div>
      </div>
    </div>
  );
}
