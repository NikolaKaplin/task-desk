"use client";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";

import { Button } from "@/components/ui/button";
import { CreateTaskForm } from "@/components/shared/projects/create-task-form";
import TaskColumn from "@/components/shared/projects/task-column";
import TaskDetails from "@/components/shared/projects/task-details";
import { listIds } from "@/app/constants";
import {
  getProjectById,
  getTasksByProjectId,
  upgateTaskStatusById,
} from "@/app/actions";
import { getUserSession } from "@/lib/get-session-server";

export interface Task {
  id: string;
  name: string;
  description: string;
  performers: string[];
  image?: string;
  taskStatus: "ISSUED" | "PROCESSING" | "REVIEW" | "COMPLETED";
}

export default function ProjectTasksPage() {
  const [user, setUser] = useState();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [project, setProject] = useState();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const path = usePathname().split("/").pop();

  useEffect(() => {
    (async () => {
      const user = await getUserSession();
      if (user) setUser(user);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const projectGet = await getProjectById(Number(path));
      if (projectGet) setProject(projectGet);
    })();
  }, [path]);

  useEffect(() => {
    (async () => {
      const tasksGet = await getTasksByProjectId(Number(path));
      const tasksGetConverted = tasksGet.map((task) => ({
        ...task,
        id: task.id.toString(),
      }));
      if (tasksGetConverted) setTasks(tasksGetConverted);
    })();
  }, [path]);

  const getTasksByStatus = useCallback(
    (status: Task["taskStatus"]) =>
      tasks.filter((task) => task.taskStatus === status),
    [tasks]
  );

  const onDragEnd = useCallback(async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const newStatus = destination.droppableId as Task["taskStatus"];
      const taskId = Number(draggableId);

      // Оптимистично обновляем состояние
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggableId ? { ...task, taskStatus: newStatus } : task
        )
      );

      try {
        // Вызываем функцию для обновления статуса задачи на сервере
        await upgateTaskStatusById(taskId, newStatus);
      } catch (error) {
        console.error("Failed to update task status:", error);
        // В случае ошибки, возвращаем задачу в исходное состояние
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === draggableId
              ? {
                  ...task,
                  taskStatus: source.droppableId as Task["taskStatus"],
                }
              : task
          )
        );
      }
    }
  }, []);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseTaskDetails = () => {
    setSelectedTask(null);
  };

  return (
    <div>
      {user ? (
        <div>
          {tasks ? (
            <div className="bg-gray-900 min-h-screen">
              {project ? (
                <div className="container mx-auto p-4 h-screen flex flex-col">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div className="flex items-center">
                      <Link href="/projects">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mr-4 text-green-500 hover:text-green-400"
                        >
                          <ArrowLeft className="mr-2 h-8 w-8" />
                        </Button>
                      </Link>
                      <h1 className="text-xl md:text-2xl lg:text-3xl text-green-500 font-bold">
                        {project.name}
                      </h1>
                    </div>
                    <CreateTaskForm
                      authorId={user?.id}
                      projectId={project.id}
                      onTaskCreated={(newTask) => setTasks([...tasks, newTask])}
                    />
                  </div>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="flex flex-col md:flex-row flex-grow overflow-x-auto gap-4">
                      {listIds.map((listId) => (
                        <Droppable droppableId={listId.name} key={listId.name}>
                          {(provided, snapshot) => (
                            <TaskColumn
                              title={listId.name
                                .replace("-", " ")
                                .toUpperCase()}
                              tasks={getTasksByStatus(
                                listId.name as Task["taskStatus"]
                              )}
                              description={listId.description}
                              colors={listId.colors}
                              status={listId.name as Task["taskStatus"]}
                              provided={provided}
                              snapshot={snapshot}
                              onTaskClick={handleTaskClick}
                            />
                          )}
                        </Droppable>
                      ))}
                    </div>
                  </DragDropContext>
                </div>
              ) : null}
              {selectedTask && (
                <TaskDetails
                  task={selectedTask}
                  onClose={handleCloseTaskDetails}
                />
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
