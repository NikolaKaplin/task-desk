'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'
import { updateProfile } from "@/app/actions"
import AvatarUpload from "../../avatar-upload"


const softwareDevelopers = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'Game Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Data Engineer',
  'Machine Learning Engineer',
  'Quality Assurance Engineer',
  'UI/UX Designer',
  'Systems Analyst',
  'Embedded Systems Developer',
  'Cloud Engineer',
  'Blockchain Developer',
  'Security Engineer',
  'Game Designer',
  'Database Administrator'
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
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

export default function ProfileForm({user}:{user: number}) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      id: user,
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      devStatus: [],
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)

    const result = await updateProfile(data)

    setIsLoading(false)

    if (result.edit) {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
      router.refresh()
    } else {
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    }
  }

  const handleStatusSelect = (status: string) => {
    const currentDevStatus = form.getValues("devStatus")
    if (!currentDevStatus.includes(status)) {
      form.setValue("devStatus", [...currentDevStatus, status])
    }
  }

  const handleStatusRemove = (status: string) => {
    const currentDevStatus = form.getValues("devStatus")
    form.setValue("devStatus", currentDevStatus.filter(s => s !== status))
  }

  return (
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
  )
}

