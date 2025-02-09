import {
  Draggable,
  type DroppableProvided,
  type DroppableStateSnapshot,
} from "react-beautiful-dnd";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CreateTaskForm } from "./create-task-form";

export interface Task {
  id: string;
  authorId: number;
  name: string;
  description: string;
  performers: string[];
  image?: string;
  status: "ISSUED" | "PROCESSING" | "REVIEW" | "DONE";
  createdAt: Date;
  updatedAt: Date;
  deadline: Date;
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
  usersArr: any;
  user: any;
  project: any;
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
  usersArr,
  user,
  project,
}: TaskColumnProps) {
  return (
    <Card className="w-full md:w-80 flex-shrink-0 flex flex-col h-[calc(100vh-200px)] md:h-full bg-gray-800 border-gray-700">
      {usersArr ? (
        <>
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
                <Badge
                  variant="secondary"
                  className="bg-gray-700 text-green-400"
                >
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
              className="min-h-[100px] transition-colors duration-300"
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`relative mb-4 transition-all duration-300 ${
                        snapshot.isDragging ? "opacity-50" : ""
                      }`}
                      style={{
                        ...provided.draggableProps.style,
                      }}
                      onClick={() => onTaskClick(task)}
                    >
                      <Card className="bg-gray-700 border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-start space-x-3 flex-grow">
                              <Avatar className="w-10 h-10">
                                <AvatarImage
                                  src={
                                    usersArr.find((u) => u.id === task.authorId)
                                      ?.avatar
                                  }
                                  alt="Author"
                                />
                                <AvatarFallback></AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <h3 className="font-semibold text-green-400 text-lg line-clamp-2">
                                  {task.title}
                                </h3>
                                <span className="text-xs text-gray-400">
                                  {format(
                                    new Date(task.createdAt),
                                    "dd MMM yyyy"
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                            {task.description}
                          </p>
                          {task.image && task.image !== "" && (
                            <img
                              src={task.image || "/placeholder.svg"}
                              alt={task.name}
                              className="mt-2 rounded-md w-full h-32 object-cover mb-2"
                            />
                          )}
                          <div className="flex flex-col text-xs text-gray-400 mt-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-green-400">
                                Дедлайн:
                              </span>
                              <span className="bg-gray-800 rounded px-2 py-1">
                                {format(
                                  new Date(task.deadline),
                                  "dd MMM yyyy HH:mm"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Изменено:</span>
                              <span className="bg-gray-800 rounded px-2 py-1">
                                {format(
                                  new Date(task.updatedAt),
                                  "dd MMM yyyy HH:mm"
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-end mt-2">
                            <div className="flex -space-x-3 overflow-hidden">
                              {JSON.parse(task.performers).map(
                                (userId, index) => {
                                  const user = usersArr.find(
                                    (u) => u.id === userId
                                  );
                                  return (
                                    <Avatar
                                      key={userId}
                                      className={`inline-block border-2 border-gray-800 w-8 h-8 transition-transform hover:translate-y-[-4px] ${
                                        index > 0 ? "hover:translate-x-1" : ""
                                      }`}
                                    >
                                      <AvatarImage
                                        src={user?.avatar}
                                        alt={`${user?.firstName} ${user?.lastName}`}
                                      />
                                      <AvatarFallback className="bg-green-600 text-gray-200">
                                        {user?.firstName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                  );
                                }
                              )}
                            </div>
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
        </>
      ) : null}
    </Card>
  );
}
