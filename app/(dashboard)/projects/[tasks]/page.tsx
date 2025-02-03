"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
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
import { initialTasks, listIds } from "@/app/constants";

export interface Task {
  id: string;
  name: string;
  description: string;
  performers: string[];
  image?: string;
  status: "ISSUE" | "IN PROGRESS" | "REVIEW" | "COMPLETED";
}





export default function ProjectTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [project, setproject] = useState();

  useEffect(() => {
    (async() =>{
    })();
  },[])


  const getTasksByStatus = useCallback(
    (status: Task["status"]) => tasks.filter((task) => task.status === status),
    [tasks]
  );

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

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

  return (
    <div className="container mx-auto p-4 h-screen flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Project</h1>
        </div>
        <CreateTaskForm />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row flex-grow overflow-x-auto gap-4">
          {listIds.map((listId) => (
            <Droppable droppableId={listId.name} key={listId}>
              {(provided, snapshot) => (
                <TaskColumn
                  title={listId.name.replace("-", " ").toUpperCase()}
                  tasks={getTasksByStatus(listId.name)}
                  description={listId.description}
                  colors={listId.colors}
                  status={listId.name}
                  provided={provided}
                  snapshot={snapshot}
                />
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
