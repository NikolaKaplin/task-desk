"use client"

import type React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { loginSchema, type TFormLoginValues } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormInput } from "./form-input"
import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export const LoginForm: React.FC = () => {
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<TFormLoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: TFormLoginValues) => {
    try {
      const resp = await signIn("credentials", {
        ...data,
        redirect: false,
      })

      if (!resp?.ok) {
        throw Error()
      }

      router.push("/")
    } catch (error) {
      console.error("Error [LOGIN]", error)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось войти в аккаунт",
      })
    }
  }

  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <FormInput name="email" label="E-Mail" required />
        <FormInput name="password" label="Пароль" type="password" required />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-12 text-base bg-green-500 hover:bg-green-600 text-white"
          onClick={form.handleSubmit(onSubmit)}
        >
          {form.formState.isSubmitting ? "Вход..." : "Войти"}
        </Button>
      </div>
    </FormProvider>
  )
}

