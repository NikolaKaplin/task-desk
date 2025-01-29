import {
  Draggable,
  type DroppableProvided,
  type DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  tasks: Task[];
  status: Task["status"];
  provided: DroppableProvided;
  snapshot: DroppableStateSnapshot;
}

export default function TaskColumn({
  title,
  tasks,
  status,
  provided,
  snapshot,
}: TaskColumnProps) {
  return (
    <Card className="w-full md:w-80 flex-shrink-0 flex flex-col h-[calc(100vh-200px)] md:h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        <Badge variant="secondary">{tasks.length}</Badge>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`min-h-[100px] transition-colors duration-300 ${
            snapshot.isDraggingOver ? "bg-green-100" : ""
          }`}
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
                >
                  <Card>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{task.name}</h3>
                      <p className="text-sm text-gray-500">
                        {task.description}
                      </p>
                      {task.image && (
                        <img
                          src={task.image || "/placeholder.svg"}
                          alt={task.name}
                          className="mt-2 rounded-md w-full h-32 object-cover"
                        />
                      )}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {task.performers.map((performer, index) => (
                          <Badge key={index} variant="outline">
                            {performer}
                          </Badge>
                        ))}
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
