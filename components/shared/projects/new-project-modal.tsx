import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"


export interface Task {
  id: string
  name: string
  description: string
  performers: string[]
  image?: string
  status: "to-do" | "in-progress" | "problems" | "completed"
}

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onAddTask: (task: Task) => void
}

const PERFORMERS = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams"]

export default function NewProjectModal({ isOpen, onClose, onAddTask }: NewProjectModalProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [performers, setPerformers] = useState<string[]>([])
  const [image, setImage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newTask: Task = {
      id: Date.now().toString(),
      name,
      description,
      performers,
      image,
      status: "to-do",
    }
    onAddTask(newTask)
    onClose()
    // Reset form
    setName("")
    setDescription("")
    setPerformers([])
    setImage("")
  }

  const handlePerformerChange = (performer: string) => {
    setPerformers((prev) => (prev.includes(performer) ? prev.filter((p) => p !== performer) : [...prev, performer]))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Task Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Performers</Label>
            <div className="space-y-2">
              {PERFORMERS.map((performer) => (
                <div key={performer} className="flex items-center space-x-2">
                  <Checkbox
                    id={performer}
                    checked={performers.includes(performer)}
                    onCheckedChange={() => handlePerformerChange(performer)}
                  />
                  <Label htmlFor={performer}>{performer}</Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} />
          </div>
          <Button type="submit">Create Project</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

