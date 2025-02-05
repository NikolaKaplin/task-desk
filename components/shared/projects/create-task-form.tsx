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
import { Plus, PlusCircle, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask } from "@/app/actions";
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

const taskFormSchema = z.object({
  title: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string(),
  status: z.string(),
  performers: z.array(z.number()),
  image: z.string().optional(),
  projectId: z.number(),
  authorId: z.number(),
  deadlineDate: z.string(),
  deadlineTime: z.string(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface CreateTaskFormProps {
  onTaskCreated: (task: TaskFormValues) => void;
  projectId: number;
  authorId: number;
  users: any;
}

export function CreateTaskForm({
  onTaskCreated,
  projectId,
  authorId,
  users,
}: CreateTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      deadlineDate: "",
      deadlineTime: "",
    },
  });

  const handlePerformerSelect = (performer: string) => {
    const currentPerformers = form.getValues("performers");
    const id = Number.parseInt(performer, 10);
    if (!currentPerformers.includes(id)) {
      form.setValue("performers", [...currentPerformers, id]);
    }
  };

  const handlePerformerRemove = (performerId: number) => {
    const currentPerformers = form.getValues("performers");
    form.setValue(
      "performers",
      currentPerformers.filter((id) => Number(id) !== performerId)
    );
  };

  async function onSubmit(data: TaskFormValues) {
    setIsLoading(true);
    try {
      const deadline = new Date(`${data.deadlineDate}T${data.deadlineTime}`);
      const taskData = {
        ...data,
        deadline: deadline.toISOString(),
      };
      const createdTask = await createTask(taskData);
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
          <Plus className=" h-4 w-4" />
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
                    Title
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
                        <SelectItem
                          key={user.id}
                          value={user.id.toString()}
                          className="text-white hover:bg-gray-600"
                        >
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
                  <FormDescription className="text-gray-400 text-xs md:text-sm">
                    Select the users that will work on this task.
                  </FormDescription>
                  <FormMessage className="text-xs md:text-sm" />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.map((userId) => {
                      const user = users.find((u) => u.id === userId);
                      return user ? (
                        <Badge
                          className="justify-between bg-gray-700 text-white"
                          key={user.id}
                          variant="secondary"
                        >
                          {user.firstName} {user.lastName}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 h-auto p-0 text-gray-400 hover:text-white"
                            onClick={() => handlePerformerRemove(user.id)}
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
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="deadlineDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-green-400 text-sm md:text-base">
                      Deadline Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
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
                name="deadlineTime"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-green-400 text-sm md:text-base">
                      Deadline Time
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        className="bg-gray-700 text-green-400 border-gray-600 text-sm md:text-base"
                      />
                    </FormControl>
                    <FormMessage className="text-xs md:text-sm" />
                  </FormItem>
                )}
              />
            </div>
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
