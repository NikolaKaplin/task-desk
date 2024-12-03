"use client";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser, updateProfile } from "@/app/actions";
import { TFormRegisterValues, RegisterSchema } from "../schema";
import { FormInput } from "../form-input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { redirect, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { TFormProfileValues } from "./schema";
import { getUserSession } from "@/lib/get-session-server";
import { prisma } from "@/prisma/prisma-client";

export const ProfileForm: React.FC = ({}) => {
  const user = async () => {
    const user = await getUserSession();
    return user;
  };
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<TFormProfileValues>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit = async (data: TFormProfileValues) => {
    const updateUser = await updateProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      id: (await user()?.then((u) => u?.id)) as number,
    });
    try {
      if (updateUser.edit) {
        toast({
          variant: "default",
          title: "Данные успешно обновлены!✅",
        });
      } else {
        toast({
          variant: "default",
          title: "Ошибка обновления!❌",
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
        <FormInput
          defaultValue={user()
            ?.then((u) => u?.firstName)
            .toString()}
          name="firstName"
          label="Имя"
          required
        />
        <FormInput
          defaultValue={user()
            ?.then((u) => u?.lastName)
            .toString()}
          name="lastName"
          label="Фамилия"
          required
        />
        <FormInput
          defaultValue={user()
            ?.then((u) => u?.email)
            .toString()}
          name="email"
          label="E-Mail"
          required
        />

        <Button
          loading={form.formState.isSubmitting}
          variant={"secondary"}
          className="h-12 text-base"
          type="submit"
        >
          Save changes
        </Button>
      </form>
    </FormProvider>
  );
};
