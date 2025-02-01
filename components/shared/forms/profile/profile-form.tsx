"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { updateProfile } from "@/app/actions";
import AvatarUpload from "../../avatar-upload";
import { FormInput } from "../form-input";

const softwareDevelopers = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile Developer",
  "Game Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Data Engineer",
  "Machine Learning Engineer",
  "Quality Assurance Engineer",
  "UI/UX Designer",
  "Systems Analyst",
  "Embedded Systems Developer",
  "Cloud Engineer",
  "Blockchain Developer",
  "Security Engineer",
  "Game Designer",
  "Database Administrator",
];

const profileFormSchema = z.object({
  id: z.number(),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().max(350, {
    message: "Bio must not be longer than 350 characters.",
  }),
  devStatus: z.array(z.string()).min(1, {
    message: "Please select at least one developer status.",
  }),
  telegram: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm({ user }: { user: any }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      id: user,
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      devStatus: [],
      telegram: "",
      github: "",
      linkedin: "",
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true);

    const result = await updateProfile(data);

    setIsLoading(false);

    if (result.edit) {
      toast({
        title: "Profile updated",
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

  const handleStatusSelect = (status: string) => {
    const currentDevStatus = form.getValues("devStatus");
    if (!currentDevStatus.includes(status)) {
      form.setValue("devStatus", [...currentDevStatus, status]);
    }
  };

  const handleStatusRemove = (status: string) => {
    const currentDevStatus = form.getValues("devStatus");
    form.setValue(
      "devStatus",
      currentDevStatus.filter((s) => s !== status)
    );
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-8 mb-8">
          <div className="flex flex-col items-center">
            <AvatarUpload currentAvatarUrl="/placeholder.svg?height=200&width=200" />
          </div>
          <div className="flex-1 space-y-4">
           <FormInput name={"firstName"} type={"text"} defaultValue={user.firstName} label={"First Name"}/>
           <FormInput name={"lastName"} type={"text"} defaultValue={user.lastName} label={"Last Name"}/>
          </div>
        </div>
        <FormInput name={"email"} isMotion={false} type={"text"} defaultValue={user.email} label={"Email"}/>
        <FormInput name={"bio"} type={"text"} defaultValue={user.bio ? user.bio : ""} label={"Bio"}/>
        <FormField
          control={form.control}
          name="devStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Developer Status</FormLabel>
              <Select onValueChange={handleStatusSelect}>
                <FormControl>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {softwareDevelopers.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="text-white hover:bg-gray-600"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-400">
                Select the statuses that best describe your skills.
              </FormDescription>
              <FormMessage />
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((status) => (
                  <Badge
                    key={status}
                    variant="secondary"
                    className="bg-gray-600 text-white"
                  >
                    {status}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-0 text-gray-400 hover:text-white"
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
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="telegram"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Telegram</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your Telegram username"
                    {...field}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">GitHub</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your GitHub username"
                    {...field}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">LinkedIn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your LinkedIn profile URL"
                    {...field}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update profile"}
        </Button>
      </div>
    </FormProvider>
  );
}
