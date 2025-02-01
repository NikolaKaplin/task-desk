"use client"

import type React from "react"
import { FormProvider, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerUser } from "@/app/actions"
import { type TFormRegisterValues, RegisterSchema } from "./schema"
import { FormInput } from "./form-input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

export const RegisterForm: React.FC = () => {
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      const result = await registerUser(data)
      if (result.success) {
        toast({
          variant: 'default',
          title: "🤝",
          description: "Добро пожаловать в Altergemu",
        })
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        })
        router.push("/login/confirm")
      } else {
        toast({
          variant: "destructive",
          title: "☝",
          description: "Ваша заявка отклонена",
        })
      }
    } catch (err) {
      console.error(err)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось зарегистрироваться",
      })
    }
  }

  return (
    <FormProvider {...form}>
      <div className="space-y-4">
      <FormInput name="lastName" label="Фамилия" required />
        <FormInput name="firstName" label="Имя" required />
        <FormInput name="email" label="E-Mail" required />
        <FormInput name="password" label="Пароль" type="password" required />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-12 text-base bg-green-500 hover:bg-green-600 text-white"
          onClick={form.handleSubmit(onSubmit)}
        >
          {form.formState.isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </div>
    </FormProvider>
  )
}

