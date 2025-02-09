"use client";

import type React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/app/actions";
import { type TFormRegisterValues, RegisterSchema } from "./schema";
import { FormInput } from "./form-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { hashSync } from "bcryptjs";

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      bio: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    try {
      const regData = {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        email: data.email,
        passwordHash: hashSync(data.password),
        avatarUrl: "https://banner2.cleanpng.com/20180402/ojw/avhimsq6h.webp",
        contacts: "",
      };
      const result = await registerUser(regData);
      if (result.success) {
        toast({
          variant: "default",
          title: "🤝",
          description: "Добро пожаловать в Altergemu",
        });
        await signIn("credentials", {
          email: data.email,
          password: regData.passwordHash,
          redirect: false,
        });
        router.push("/login/confirm");
      } else {
        toast({
          variant: "destructive",
          title: "☝",
          description: "Ваша заявка отклонена",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось зарегистрироваться",
      });
    }
  };

  return (
    <FormProvider {...form}>
      <div className="space-y-4">
        <FormInput
          type={"text"}
          name="lastName"
          isMotion={true}
          label="Фамилия"
        />
        <FormInput name="firstName" isMotion={true} label="Имя" />
        <FormInput name="email" isMotion={true} label="E-Mail" />
        <FormInput name="password" label="Пароль" type="password" />
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full h-12 text-base bg-green-500 hover:bg-green-600 text-white"
          onClick={form.handleSubmit(onSubmit)}
        >
          {form.formState.isSubmitting
            ? "Регистрация..."
            : "Зарегистрироваться"}
        </Button>
      </div>
    </FormProvider>
  );
};
