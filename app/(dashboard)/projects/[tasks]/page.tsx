"use client"

import { useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { PlusCircle, ArrowLeft } from "lucide-react"
import { DragDropContext, Droppable, type DropResult } from "react-beautiful-dnd"

import { Button } from "@/components/ui/button"
import NewProjectModal from "@/components/shared/projects/new-project-modal"
import TaskColumn from "@/components/shared/projects/task-column"


export interface Task {
    id: string
    name: string
    description: string
    performers: string[]
    image?: string
    status: "to-do" | "in-progress" | "problems" | "completed"
  }

// In a real application, this data would be fetched from a server based on the project ID
const initialTasks: Task[] = [
  {
    id: "1",
    name: "Design mockups",
    description: "Create initial design mockups",
    performers: ["John Doe"],
    status: "to-do",
  },
  {
    id: "2",
    name: "Frontend development",
    description: "Implement the frontend",
    performers: ["Jane Smith"],
    status: "in-progress",
  },
  {
    id: "3",
    name: "Backend API",
    description: "Develop the backend API",
    performers: ["Bob Johnson"],
    status: "problems",
  },
  { id: "4", name: "Testing", description: "Perform QA testing", performers: ["Alice Williams"], status: "completed" },
]

const listIds = ["to-do", "in-progress", "problems", "completed"] as const

export default function ProjectTasksPage() {
  const { id } = useParams()
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false)

  const addTask = (task: Task) => {
    setTasks([...tasks, task])
  }

  const getTasksByStatus = useCallback(
    (status: Task["status"]) => tasks.filter((task) => task.status === status),
    [tasks],
  )

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) {
      return
    }

    if (source.droppableId !== destination.droppableId) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggableId ? { ...task, status: destination.droppableId as Task["status"] } : task,
        ),
      )
    }
  }, [])

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
        <Button onClick={() => setIsNewTaskModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> New Task
        </Button>
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
      <NewProjectModal isOpen={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)} onAddTask={addTask} />
    </div>
  )
}

