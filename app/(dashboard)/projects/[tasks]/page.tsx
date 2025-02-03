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
import { getProjectById, getTasksByProjectId } from "@/app/actions";
import { getUserSession } from "@/lib/get-session-server";

export interface Task {
  id: string;
  name: string;
  description: string;
  performers: string[];
  image?: string;
  status: "ISSUED" | "PROCESSING" | "REVIEW" | "COMPLETED";
}

export default function ProjectTasksPage() {
  const [user, setUser] = useState();
  const [tasks, setTasks] = useState();
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
      console.log(tasksGetConverted);
      if (tasksGetConverted) setTasks(tasksGetConverted);
    })();
  }, [path]);

  const getTasksByStatus = useCallback(
    (status) => tasks.filter((task) => task.taskStatus === status),
    [tasks]
  );

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggableId
            ? { ...task, status: destination.droppableId as Task["status"] }
            : task
        )
      );
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
                        <Droppable droppableId={listId.name} key={listId}>
                          {(provided, snapshot) => (
                            <TaskColumn
                              title={listId.name
                                .replace("-", " ")
                                .toUpperCase()}
                              tasks={getTasksByStatus(listId.name)}
                              description={listId.description}
                              colors={listId.colors}
                              status={listId.name}
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
