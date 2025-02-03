import {
  Draggable,
  type DroppableProvided,
  type DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Task {
  id: string;
  name: string;
  description: string;
  performers: string[];
  image?: string;
  status: "to-do" | "in-progress" | "problems" | "completed";
}

interface TaskColumnProps {
  title: string;
  description: string;
  colors: any;
  tasks: Task[];
  status: Task["status"];
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
  onTaskClick: (task: Task) => void;
}

export default function TaskColumn({
  title,
  description,
  colors,
  tasks,
  status,
  provided,
  snapshot,
  onTaskClick,
}: TaskColumnProps) {
  return (
    <Card className="w-full md:w-80 flex-shrink-0 flex flex-col h-[calc(100vh-200px)] md:h-full bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-green-500">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                `h-[18px] w-[18px] border-[2px] rounded-full`,
                colors[0],
                colors[1]
              )}
            />
            {title}
            <Badge variant="secondary" className="bg-gray-700 text-green-400">
              {tasks.length}
            </Badge>
          </div>
          <p className="text-sm text-gray-400">{description}</p>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-x-hidden overflow-y-auto body penis">
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[100px] transition-colors duration-300`}
        >
          {tasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`relative mb-2 transition-all duration-300 ${
                    snapshot.isDragging ? "opacity-50" : ""
                  }`}
                  style={{
                    ...provided.draggableProps.style,
                  }}
                  onClick={() => onTaskClick(task)}
                >
                  <Card className="bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors">
                    <CardContent className="p-4">
                      <div className="items-center">
                        <h3 className="font-semibold text-green-400">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                      {task.image != "" && (
                        <img
                          src={
                            task.image ||
                            "/placeholder.svghttps://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200"
                          }
                          alt={task.title}
                          className="mt-2 rounded-md w-full h-32 object-cover"
                        />
                      )}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {/* {task.performers.map((performer, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-green-500 text-green-400"
                          >
                            {performer}
                          </Badge>
                        ))} */}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      </CardContent>
    </Card>
  );
}
