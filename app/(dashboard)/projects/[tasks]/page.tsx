"use client";

import { useState, useCallback } from "react";
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

export interface Task {
  id: string;
  name: string;
  description: string;
  performers: string[];
  image?: string;
  status: "ISSUE" | "IN PROGRESS" | "PROBLEMS" | "COMPLETED";
}

const initialTasks: Task[] = [
  {
    id: "1",
    name: "Design mockups",
    description: "Create initial design mockups",
    performers: ["John Doe"],
    status: "ISSUE",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "2",
    name: "Frontend development",
    description: "Implement the frontend",
    performers: ["Jane Smith"],
    status: "IN PROGRESS",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "3",
    name: "Backend API",
    description: "Develop the backend API",
    performers: ["Bob Johnson"],
    status: "PROBLEMS",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "4",
    name: "Testing",
    description: "Perform QA testing",
    performers: ["Alice Williams"],
    status: "COMPLETED",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "5",
    name: "Design mockups",
    description: "Create initial design mockups",
    performers: ["John Doe"],
    status: "ISSUE",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "6",
    name: "Frontend development",
    description: "Implement the frontend",
    performers: ["Jane Smith"],
    status: "IN PROGRESS",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "7",
    name: "Backend API",
    description: "Develop the backend API",
    performers: ["Bob Johnson"],
    status: "PROBLEMS",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
  {
    id: "8",
    name: "Testing",
    description: "Perform QA testing",
    performers: ["Alice Williams"],
    status: "COMPLETED",
    image:
      "https://avatars.dzeninfra.ru/get-zen_doc/1873182/pub_605c73f132b80a09c6213a69_605c9d537271d71bc031ae17/scale_1200",
  },
];

const listIds = ["ISSUE", "IN PROGRESS", "PROBLEMS", "COMPLETED"] as const;

export default function ProjectTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

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
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold">Project</h1>
        </div>
        <CreateTaskForm />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row flex-grow overflow-x-auto gap-4">
          {listIds.map((listId) => (
            <Droppable droppableId={listId} key={listId}>
              {(provided, snapshot) => (
                <TaskColumn
                  title={listId.replace("-", " ").toUpperCase()}
                  tasks={getTasksByStatus(listId)}
                  status={listId}
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
