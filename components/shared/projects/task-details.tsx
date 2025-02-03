import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Task } from "./task-column";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
}

export default function TaskDetails({ task, onClose }: TaskDetailsProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-green-400 border-0 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-green-500">
            {task.name}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <h3 className="text-base md:text-lg font-semibold mb-2">
            Description
          </h3>
          <p className="text-sm md:text-base text-gray-300">
            {task.description}
          </p>
        </div>
        {task.image && (
          <div className="mt-4">
            <img
              src={task.image || "/placeholder.svg"}
              alt={task.name}
              className="rounded-md w-full max-h-48 md:max-h-64 object-cover"
            />
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-base md:text-lg font-semibold mb-2">
            Performers
          </h3>
          <div className="flex flex-wrap gap-2">
            {/* {task.performers.map((performer, index) => (
              <Badge
                key={index}
                variant="outline"
                className="border-green-500 text-green-400 text-xs md:text-sm"
              >
                {performer}
              </Badge>
            ))} */}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-base md:text-lg font-semibold mb-2">Status</h3>
          <Badge
            variant="secondary"
            className="bg-gray-700 text-green-400 text-xs md:text-sm"
          >
            {task.status}
          </Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
