"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { PlusCircle, ArrowLeft } from "lucide-react";
import {
  DragDropContext,
  Droppable,
  type DropResult,
} from "react-beautiful-dnd";

import { Button } from "@/components/ui/button";
import NewProjectModal from "@/components/shared/projects/new-project-modal";
import TaskColumn from "@/components/shared/projects/task-column";
import { CreateProjectForm } from "@/components/shared/projects/create-project-form";
import { CreateTaskForm } from "@/components/shared/projects/create-task-form";

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
  },
  {
    id: "2",
    name: "Frontend development",
    description: "Implement the frontend",
    performers: ["Jane Smith"],
    status: "IN PROGRESS",
  },
  {
    id: "3",
    name: "Backend API",
    description: "Develop the backend API",
    performers: ["Bob Johnson"],
    status: "PROBLEMS",
  },
  {
    id: "4",
    name: "Testing",
    description: "Perform QA testing",
    performers: ["Alice Williams"],
    status: "COMPLETED",
  },
];

const listIds = ["ISSUE", "IN PROGRESS", "PROBLEMS", "COMPLETED"] as const;

export default function ProjectTasksPage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

  const addTask = (task: Task) => {
    setTasks([...tasks, task]);
  };

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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link href="/projects">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Projects
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Project Tasks (ID: {id})</h1>
        </div>
        <CreateTaskForm />
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-nowrap overflow-x-auto gap-4 h-[calc(100vh-150px)]">
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
