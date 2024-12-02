import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/app/actions";
import { TFormRegisterValues, RegisterSchema } from "./schema";
import { FormInput } from "./form-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { redirect, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export const RegisterForm: React.FC = ({}) => {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<TFormRegisterValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: TFormRegisterValues) => {
    const result = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    });
    console.log({ result });
    try {
      if (result.success) {
        toast({
          variant: "default",
          title:
            "Спасибо, дождитесь подтверждения регистрации администратором!✅",
        });
        signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then(() => {
          router.push("/register/confirm");
        });
      } else {
        toast({
          variant: "default",
          title: "Ошибка регистрации!❌",
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormInput name="firstName" label="Имя" required />
        <FormInput name="lastName" label="Фамилия" required />
        <FormInput name="email" label="E-Mail" required />
        <FormInput name="password" label="Пароль" type="password" required />

        <Button
          loading={form.formState.isSubmitting}
          variant={"secondary"}
          className="h-12 text-base"
          type="submit"
        >
          Зарегистрироваться
        </Button>
      </form>
    </FormProvider>
  );
};
