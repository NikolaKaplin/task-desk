"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { setConfidentiality, updateProfile } from "@/app/actions"
import AvatarUpload from "../../avatar-upload"
import { softwareDevelopers } from "@/app/constants"
import { type ProfileFormValues, profileFormSchema } from "./schema"
import { Textarea } from "@/components/ui/textarea"
import { CustomSwitch } from "../../custom-switch"

export default function ProfileForm({ user }: { user: any }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isPublic, setIsPublic] = useState(user.isPublic || false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      id: user.id,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      bio: user.bio || "",
      devStatus: Array.isArray(user.devStatus) ? user.devStatus : [],
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      const result = await updateProfile(data)
      if (result.edit) {
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        })
        router.refresh()
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusSelect = (status: string) => {
    const currentDevStatus = form.getValues("devStatus")
    if (!currentDevStatus.includes(status)) {
      form.setValue("devStatus", [...currentDevStatus, status], { shouldValidate: true, shouldDirty: true })
    }
  }

  const handleStatusRemove = (status: string) => {
    const currentDevStatus = form.getValues("devStatus")
    form.setValue(
      "devStatus",
      currentDevStatus.filter((s: string) => s !== status),
      { shouldValidate: true, shouldDirty: true },
    )
  }

  const handlePublicToggle = (checked: boolean) => {
    (async() => {
      return await setConfidentiality(user.id, checked)})()
    setIsPublic(checked)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-8 mb-8">
          <div className="flex flex-col items-center">
            <AvatarUpload currentAvatarUrl="/placeholder.svg?height=200&width=200" />
          </div>
          <div className="flex-1 space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">First Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-gray-700 border-gray-600 text-white" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" className="bg-gray-700 border-gray-600 text-white" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-300">Bio</FormLabel>
              <FormControl>
                <Textarea {...field} className="bg-gray-700 border-gray-600 text-white min-h-[100px]" />
              </FormControl>
            </FormItem>
          )}
        />
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
                    <SelectItem key={status} value={status} className="text-white hover:bg-gray-600">
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="text-gray-400">
                Select the statuses that best describe your skills.
              </FormDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {Array.isArray(field.value) &&
                  field.value.map((status: string) => (
                    <Badge key={status} variant="secondary" className="bg-gray-600 text-white">
                      {status}
                      <Button
                        type="button"
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
        <div className="flex items-center space-x-3 py-2">
          <CustomSwitch id="public-profile" checked={isPublic} onCheckedChange={handlePublicToggle} />
          <FormLabel htmlFor="public-profile" className="text-gray-300 font-medium cursor-pointer select-none">
            {isPublic ? "Public Profile" : "Private Profile"}
          </FormLabel>
        </div>
        <FormDescription className="text-gray-400">
          {isPublic ? "Your profile is visible to everyone." : "Your profile is only visible to you."}
        </FormDescription>
        <Button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white"
          disabled={isLoading || !form.formState.isDirty}
        >
          {isLoading ? "Updating..." : "Update profile"}
        </Button>
      </form>
    </Form>
  )
}

