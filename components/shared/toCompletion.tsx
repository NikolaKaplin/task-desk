import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ToCompletionCard from "@/components/shared/toComplitionCard";

export default function ToCompletion() {
  return (
    <div className="h-2/3 w-3/12  bg-gray-100 rounded-2xl">
      <div className="grid place-items-center">
        <h3 className=" pt-5 text-2xl text-center font-bold">К выполнению</h3>
        <div className="grid place-items-center">
          <ToCompletionCard />
          <ToCompletionCard />
          <ToCompletionCard />
        </div>
        <div className=" flex h-12 items-center mt-5 mb-5 rounded-lg w-10/12 bg-white">
          <Button variant="outline" className="ml-5 ">
            <Plus />
          </Button>
          <h3 className="ml-5">Добавить задачу</h3>
        </div>
      </div>
    </div>
  );
}
