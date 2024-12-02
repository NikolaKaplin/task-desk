"use client";
import TaskCard from "@/components/shared/toComplitionCard";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { CodeXml, Github, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToCompletion from "@/components/shared/toCompletion";
import Processed from "@/components/shared/processed";
import Completed from "@/components/shared/comleted";
import { Header } from "@/components/shared/header";
import { Title } from "@/components/shared/title";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { RegisterForm } from "@/components/shared/forms/register-form";

export default function Register() {
  const pathName =
    usePathname().replace("/", "").charAt(0).toUpperCase() +
    usePathname().replace("/", "").slice(1);
  return (
    <div className=" flex flex-wrap content-center bg-gradient-to-tl from-zinc-900 via-violet-600 to-indigo-600 min-h-screen min-w-screen justify-center bg-cover">
      <div className=" bg-black rounded-3xl min-h-96 w-2/5 p-5 text-white">
        <div className=" flex gap-2 items-center justify-center border-b-2">
          <CodeXml size={50} />
          <Title className=" flex text-center" size="xl" text="Altergemu" />
        </div>
        <div className=" p-5 mt-5 text-white  bg-neutral-900 w-full rounded-2xl  border border-stone-600 ">
          <div className="text-center content-center">
            <Title size="md" text={pathName} />
          </div>
          <RegisterForm />
        </div>
        <p className="mt-5">
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
