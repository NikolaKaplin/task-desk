"use client";
import { confirmUser } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { X } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import { useIndicatorsVersionUpdater } from "./navbar";

interface Props {
  a: Prisma.UserUpdateInput;
  isDelete: boolean;
  className?: string;
  icon?: JSX.Element;
}

export const ButtonApprove: React.FC<Props> = ({
  a,
  isDelete,
  icon,
  className,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const updateIndicator = useIndicatorsVersionUpdater();
  return (
    <button
      onClick={() => {
        confirmUser(a, isDelete)
          .then(() => router.refresh())
          .then(() =>
            toast({
              title: isDelete
                ? "Пользователь удален ❌"
                : "Пользователь одобрен ✅",
              variant: "default",
            })
          )
          .then(() => updateIndicator());
      }}
      className={isDelete ? cn("text-red-600") : cn("text-green-600")}
    >
      {icon}
    </button>
  );
};
