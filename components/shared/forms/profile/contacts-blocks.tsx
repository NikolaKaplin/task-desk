"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const contactsSchema = z.object({
  telegram: z.string().optional(),
  github: z.string().optional(),
  linkedin: z.string().optional(),
})

type ContactsFormValues = z.infer<typeof contactsSchema>

export default function ContactsBlock({ user }: { user: any }) {
  const form = useForm<ContactsFormValues>({
    resolver: zodResolver(contactsSchema),
    defaultValues: {
      telegram: user.telegram || "",
      github: user.github || "",
      linkedin: user.linkedin || "",
    },
  })

  const onSubmit = (data: ContactsFormValues) => {
    console.log(data)
    // Here you would typically update the user's contacts
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-green-400">Contacts</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
              Update contacts
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

