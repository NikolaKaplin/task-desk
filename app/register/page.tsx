"use client";

import { CodeXml } from "lucide-react";
import { Title } from "@/components/shared/title";
import { usePathname } from "next/navigation";
import { RegisterForm } from "@/components/shared/forms/register-form";

export default function Register() {
  const pathName =
    usePathname().replace("/", "").charAt(0).toUpperCase() +
    usePathname().replace("/", "").slice(1);

  return (
    <div className="flex flex-wrap content-center bg-gradient-to-tl from-zinc-900 via-violet-600 to-indigo-600 min-h-screen w-full justify-center bg-cover p-4">
      <div className="bg-black rounded-3xl min-h-96 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 p-4 sm:p-5 text-white">
        <div className="flex gap-2 items-center justify-center border-b-2 pb-4">
          <CodeXml size={40} className="sm:w-12 sm:h-12" />
          <Title
            className="flex text-center text-xl sm:text-2xl"
            size="xl"
            text="Altergemu"
          />
        </div>
        <div className="p-3 sm:p-5 mt-4 sm:mt-5 text-white bg-neutral-900 w-full rounded-2xl border border-stone-600">
          <div className="text-center content-center mb-4">
            <Title size="md" text={pathName} className="text-lg sm:text-xl" />
          </div>
          <RegisterForm />
        </div>
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-center">
          Already have an account?{" "}
          <a href="/login" className="font-bold">
            Login
          </a>{" "}
          instead.
        </p>
      </div>
    </div>
  );
}
