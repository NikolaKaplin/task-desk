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
import { createTask, getTasksByProjectId, getUsers } from "@/app/actions";
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { getUserSession } from "@/lib/get-session-server";

const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
  status: z.string(),
  performers: z.array(z.string()),
  image: z.string().optional(),
  projectId: z.number(),
  authorId: z.number(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface CreateTaskFormProps {
  onTaskCreated: (task: TaskFormValues) => void;
  projectId: number;
  authorId: number;
}

export function CreateTaskForm({
  onTaskCreated,
  projectId,
  authorId,
}: CreateTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const usersArr = await getUsers();
      if (usersArr) {
        setUsers(usersArr);
      }
    })();
  }, []);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "ISSUE",
      performers: [],
      projectId: Number(projectId),
      authorId: authorId,
      image: "",
    },
  });

  const handlePerformerSelect = (performer: string) => {
    const currentPerformers = form.getValues("performers");
    if (!currentPerformers.includes(performer)) {
      form.setValue("performers", [...currentPerformers, performer]);
    }
  };

  const handlePerformerRemove = (performer: string) => {
    const currentPerformers = form.getValues("performers");
    form.setValue(
      "performers",
      currentPerformers.filter((p) => p !== performer)
    );
  };

  async function onSubmit(data: TaskFormValues) {
    setIsLoading(true);
    try {
      const createdTask = await createTask(data);
      setIsLoading(false);
      if (createdTask) {
        toast({
          title: "Task created",
          description: "Your task has been successfully created.",
        });
        onTaskCreated(createdTask);
        setIsOpen(false);
        form.reset();
      } else {
        throw new Error("Failed to create task");
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "There was a problem creating your task.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 text-white text-sm md:text-base">
          <PlusCircle className="mr-2 h-4 w-4" /> New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-green-400 border-0 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold text-green-500">
            Create New Task
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-6"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-400 text-sm md:text-base">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your task name"
                      {...field}
                      className="bg-gray-700 text-green-400 border-gray-600 text-sm md:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-400 text-sm md:text-base">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Your task description"
                      {...field}
                      className="bg-gray-700 text-green-400 border-gray-600 text-sm md:text-base"
                    />
                  </FormControl>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-400 text-sm md:text-base">
                    Status
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 text-green-400 border-gray-600 text-sm md:text-base">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 text-green-400">
                      <SelectItem value="ISSUE">Issue</SelectItem>
                      <SelectItem value="IN PROGRESS">In Progress</SelectItem>
                      <SelectItem value="REVIEW">Review</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs md:text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="performers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-400 text-sm md:text-base">
                    Performers
                  </FormLabel>
                  <Select onValueChange={handlePerformerSelect}>
                    <FormControl>
                      <SelectTrigger className="bg-gray-700 text-green-400 border-gray-600 text-sm md:text-base">
                        <SelectValue placeholder="Select performers" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-700 text-green-400">
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.firstName}>
                          <div className="flex items-center gap-2 md:gap-4">
                            <span className="text-xs md:text-sm">
                              {user.firstName} {user.lastName}
                            </span>
                            <Avatar className="w-6 h-6 md:w-8 md:h-8">
                              <AvatarImage src={user.avatar} />
                            </Avatar>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription className="text-gray-400 text-xs md:text-sm">
                    Select the users that will work on this task.
                  </FormDescription>
                  <FormMessage className="text-xs md:text-sm" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((performer) => (
                      <Badge
                        key={performer}
                        variant="secondary"
                        className="bg-gray-700 text-green-400 flex items-center text-xs md:text-sm"
                      >
                        {performer}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-1 h-auto p-0 text-green-400 hover:text-green-300"
                          onClick={() => handlePerformerRemove(performer)}
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
            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white text-sm md:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
