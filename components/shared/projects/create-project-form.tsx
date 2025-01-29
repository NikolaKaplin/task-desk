"use client";

import { useState, useEffect } from "react";
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
import { createProject, getUsers } from "@/app/actions";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getUserSession } from "@/lib/get-session-server";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
  content: z.string(),
  projectStatus: z.string(),
  createdAt: z.date(),
  users: z.array(z.number()),
});

export type Project = {
  name: string;
  content: string;
  authorId: number;
  projectStatus: string;
  createdAt: Date;
  users: number[];
};

type ProjectFormValues = z.infer<typeof profileFormSchema>;

type User = {
  id: number;
  firstName: string;
  lastName: string;
  avatar?: string;
};

export function CreateProjectForm() {
  const [authorId, setAuthorId] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const usersArr = await getUsers();
      if (usersArr) {
        setUsers(usersArr);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const userSession = await getUserSession();
      if (userSession) {
        setAuthorId(userSession.id);
      }
    })();
  }, []);

  const handleStatusSelect = (userId: string) => {
    const currentUsers = form.getValues("users");
    const id = Number.parseInt(userId, 10);
    if (!currentUsers.includes(id)) {
      form.setValue("users", [...currentUsers, id]);
    }
  };

  const handleStatusRemove = (userId: number) => {
    const currentUsers = form.getValues("users");
    form.setValue(
      "users",
      currentUsers.filter((id) => id !== userId)
    );
  };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      content: "",
      description: "",
      projectStatus: "DEVELOPMENT",
      createdAt: new Date(),
      users: [],
    },
  });

  async function onSubmit(data: ProjectFormValues) {
    setIsLoading(true);
    const project: Project = {
      authorId: authorId,
      content: JSON.stringify({
        users: data.users,
        description: data.description,
        projects: [],
      }),
      createdAt: data.createdAt,
      name: data.name,
      projectStatus: data.projectStatus,
      users: data.users,
    };

    const projectCreate = await createProject(project);
    setIsLoading(false);

    if (projectCreate?.success) {
      toast({
        title: "Project created",
        description: "Your project has been successfully created.",
      });
      router.refresh();
      setIsOpen(false);
    } else {
      toast({
        title: "Error",
        description: "There was a problem creating your project.",
        variant: "destructive",
      });
    }
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
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your project name" {...field} />
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
                    <Textarea placeholder="Project description" {...field} />
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
                  <FormLabel>Users</FormLabel>
                  <Select onValueChange={handleStatusSelect}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select users" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          <div className="flex items-center gap-4">
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
                    {field.value.map((userId) => {
                      const user = users.find((u) => u.id === userId);
                      return user ? (
                        <Badge
                          className="justify-between"
                          key={user.id}
                          variant="secondary"
                        >
                          {user.firstName} {user.lastName}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => handleStatusRemove(user.id)}
                          >
                            <Avatar>
                              <AvatarImage src={user.avatar} />
                            </Avatar>
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
