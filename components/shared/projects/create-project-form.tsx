"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import { Select, SelectContent, SelectItem } from "@/components/ui/select"
import { getUsers } from "@/app/actions"
import React from "react"

interface CreateProjectFormProps {
  onSubmit: (name: string, description: string) => void
}



export function CreateProjectForm({ onSubmit, user}: CreateProjectFormProps & { user: any }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [users, setUsers] = useState()


  React.useEffect(() => {
    (async() => {
      const usersArr = await getUsers();
      if (usersArr){
        setUsers(usersArr)
      }
    })();
  }, [])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(name, description)
    setName("")
    setDescription("")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex justify-center">
          <AvatarUpload currentAvatarUrl="/placeholder.svg?height=100&width=100" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Your email address" {...field} />
              </FormControl>
              <FormDescription>
                This email will be used for account-related notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can @mention other users and organizations to link to them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="devStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Developer Status</FormLabel>
              <Select onValueChange={handleStatusSelect}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {softwareDevelopers.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the statuses that best describe your skills.
              </FormDescription>
              <FormMessage />
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((status) => (
                  <Badge key={status} variant="secondary">
                    {status}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => handleStatusRemove(status)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update profile"}
        </Button>
      </form>
    </Form>
      </DialogContent>
    </Dialog>
  )
}

