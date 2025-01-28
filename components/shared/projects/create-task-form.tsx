"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProject, createTask, getUsers } from "@/app/actions";
import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AvatarUpload from "../avatar-upload";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { getUserSession } from "@/lib/get-session-server";
import { set } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ProjectStatus } from "@prisma/client";

const taskFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
  content: z.string(),
  taskStatus: z.string(),
  createdAt: z.date(),
  users: z.array(z.string()),
  projectId: z.number(),
});

export type Project = {
  title: string;
  content: string;
  authorId: number;
  projectId: number;
  taskStatus: string;
  createdAt: Date;
};

type ProjectFormValues = z.infer<typeof taskFormSchema>;

export function CreateTaskForm() {
  const [authorId, setAuthorId] = useState(0);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    (async () => {
      const usersArr = await getUsers();
      if (usersArr) {
        setUsers(usersArr);
      }
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const userSession = await getUserSession();
      if (userSession) {
        setAuthorId(userSession.id);
      }
    })();
  }, []);
  const handleStatusSelect = (status: string) => {
    const currentDevStatus = form.getValues("users");
    if (!currentDevStatus.includes(status)) {
      form.setValue("users", [...currentDevStatus, status]);
    }
  };

  const handleStatusRemove = (status: string) => {
    const currentDevStatus = form.getValues("users");
    form.setValue(
      "users",
      currentDevStatus.filter((s) => s !== status)
    );
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      name: "",
      content: "",
      description: "",
      taskStatus: "",
      projectId: 0,
      createdAt: new Date(),
      users: [],
    },
  });

  async function onSubmit(data: ProjectFormValues) {
    console.log("penis");
    setIsLoading(true);
    const project: Project = {
      authorId: authorId,
      title: data.name,
      content: JSON.stringify({ users: [], description: data.description }),
      createdAt: data.createdAt,
      projectId: 1,
      taskStatus: data.taskStatus,
    };

    const projectCreate = await createTask(project);
    setIsLoading(false);

    if (projectCreate?.success) {
      toast({
        title: "Task created",
        description: "Your profile has been successfully updated.",
      });
      router.refresh();
    } else {
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> New Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your task name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Developer Status</FormLabel>
                  <Select onValueChange={handleStatusSelect}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select users" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem
                          className=""
                          key={user.firstName}
                          value={user.firstName}
                        >
                          <div className=" flex items-center gap-4">
                            {user.firstName} {user.lastName}{" "}
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                            </Avatar>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the users that are working on this project.
                  </FormDescription>
                  <FormMessage />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((status) => (
                      <Badge
                        className=" justify-between"
                        key={status}
                        variant="secondary"
                      >
                        {status}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => handleStatusRemove(status)}
                        >
                          <Avatar>
                            <AvatarImage
                              src={
                                users.find((user) => user.firstName === status)
                                  ?.avatar
                              }
                            />
                          </Avatar>
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
  );
}
