"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Task } from "./task-column"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { X, Calendar, Clock, Users, Edit2 } from "lucide-react"
import { updateTask } from "@/app/actions"

interface TaskDetailsProps {
  task: Task
  onClose: () => void
  usersArr: any[]
  onSave: (updatedTask: Task) => void,
  user: any
}

export default function TaskDetails({ task, onClose, usersArr, user }: TaskDetailsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState(task)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const updatedTask = await updateTask(editedTask)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update task:", error)
      // Optionally, show an error message to the user
    }
  }

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }))
  }

  const handlePerformerSelect = (performerId: string) => {
    const currentPerformers = JSON.parse(editedTask.performers)
    const numericId = Number(performerId)
    if (!currentPerformers.includes(numericId)) {
      handleChange("performers", JSON.stringify([...currentPerformers, numericId]))
    } else {
      handleChange("performers", JSON.stringify(currentPerformers.filter((id: number) => id !== numericId)))
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-green-400 border-0 sm:max-w-[550px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-green-500 flex items-center gap-2">
            {isEditing ? <Edit2 className="w-6 h-6" /> : null}
            {isEditing ? "Edit Task" : task.title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[calc(90vh-150px)] pr-4">
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSave()
              }}
              className="space-y-6"
            >
              <div>
                <Label htmlFor="title" className="text-green-400 text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editedTask.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="bg-gray-700 text-green-400 border-gray-600 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description" className="text-green-400 text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editedTask.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="bg-gray-700 text-green-400 border-gray-600 mt-1 min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="deadline" className="text-green-400 text-sm font-medium">
                  Deadline
                </Label>
                <div className="flex items-center mt-1">
                  <Calendar className="mr-2 h-4 w-4 text-green-500" />
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={format(new Date(editedTask.deadline), "yyyy-MM-dd'T'HH:mm")}
                    onChange={(e) => handleChange("deadline", new Date(e.target.value))}
                    className="bg-gray-700 text-green-400 border-gray-600"
                  />
                </div>
              </div>
              <div>
                <Label className="text-green-400 text-sm font-medium">Performers</Label>
                <Select onValueChange={handlePerformerSelect}>
                  <SelectTrigger className="bg-gray-700 text-green-400 border-gray-600 mt-1">
                    <SelectValue placeholder="Select performers" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 text-green-400 max-h-[200px]">
                    {usersArr.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()} className="text-white hover:bg-gray-600">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          {user.firstName} {user.lastName}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex flex-wrap gap-2 mt-2">
                  {JSON.parse(editedTask.performers).map((performerId: number) => {
                    const user = usersArr.find((u) => u.id === performerId)
                    return user ? (
                      <Badge
                        key={user.id}
                        variant="secondary"
                        className="bg-gray-700 text-green-400 flex items-center gap-2 py-1 px-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {user.firstName} {user.lastName}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePerformerSelect(user.id.toString())}
                          className="h-auto p-0 text-green-400 hover:text-green-300 ml-1"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-500">Description</h3>
                <p className="text-sm text-gray-300">{task.description}</p>
              </div>
              {task.image && (
                <div>
                  <img
                    src={task.image || "/placeholder.svg"}
                    alt={task.title}
                    className="rounded-md w-full max-h-48 md:max-h-64 object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-500 flex items-center">
                  <Clock className="mr-2 h-5 w-5" /> Deadline
                </h3>
                <p className="text-sm text-gray-300">{format(new Date(task.deadline), "dd MMM yyyy HH:mm")}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-green-500 flex items-center">
                  <Users className="mr-2 h-5 w-5" /> Performers
                </h3>
                <div className="flex flex-wrap gap-2">
                  {JSON.parse(task.performers).map((performer: number, index: number) => {
                    const user = usersArr.find((u) => u.id === performer)
                    return user ? (
                      <Badge
                        key={index}
                        variant="outline"
                        className="border-green-500 text-green-400 text-xs py-1 px-2 flex items-center gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        {user.firstName} {user.lastName}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
              <div>
                <Badge variant="secondary" className="bg-gray-700 text-green-400 text-xs">
                  {task.taskStatus}
                </Badge>
              </div>
            </div>
          )}
        </ScrollArea>
        {task.authorId == user.id ? (<DialogFooter className="justify-start w-full ">
          {isEditing ? (
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
              Save Changes
            </Button>
          ) : (
            <Button onClick={handleEdit} className="bg-green-600 hover:bg-green-700 text-white">
              Edit
            </Button>
          )}
        </DialogFooter>) : null}
      </DialogContent>
    </Dialog>
  )
}

