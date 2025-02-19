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
import { getTasksByProjectId } from "@/app/actions";
import { Play } from "lucide-react";

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
  projectId: string;
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
  projecNameIsHidden: boolean;
  onCreateTask: (task: Task) => void;
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
  projecNameIsHidden,
  onCreateTask,
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
                            <div className="flex items-start justify-between space-x-3 flex-grow">
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
                              <h3 className="font-semibold text-green-400 line-clamp-2">
                                {task.title}
                              </h3>
                              <div className="flex flex-col">
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
                              {projecNameIsHidden ? null : (
                                <>
                                  <span className="font-semibold text-green-400">
                                    Проект:
                                  </span>
                                  <span className="bg-gray-800 rounded px-2 py-1">
                                    {project !== null
                                      ? project.find(
                                          (p) => p.id === task.projectId
                                        ).name
                                      : null}
                                  </span>
                                </>
                              )}
                            </div>
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
          {title === "ISSUED" ? (
            <div>
              {projecNameIsHidden ? (
                <CardFooter
                  onClick={onCreateTask}
                  className="hidden lg:flex transition-colors duration-300 cursor-pointer text-green-400 border-dashed border-2 border-green-400 rounded-b-xl items-center justify-center hover:animate-pulse hover:border-indigo-400 hover:text-indigo-400 shadow-lg hover:shadow-xl"
                >
                  <div className=" flex flex-col items-center justify-center ">
                    <h3 className="text-xl font-semibold text-center">
                      Создать новую задачу
                    </h3>
                    <Play
                      strokeWidth={1.75}
                      absoluteStrokeWidth
                      className="w-6 h-6"
                    />
                  </div>
                </CardFooter>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </Card>
  );
}
