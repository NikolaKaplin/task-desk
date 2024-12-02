"use client";

import { CodeXml, Github, Plus } from "lucide-react";
import { Title } from "@/components/shared/title";
import { usePathname } from "next/navigation";
import { LoginForm } from "@/components/shared/forms/login-form";

const stats = [{ name: "Login" }, { pa: "Sign In" }];

export default function Login() {
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
          <div>
            <LoginForm />
          </div>
        </div>
        <p className="mt-5">
          Dont have an account?{" "}
          <a className=" font-bold" href="/register">
            Sign up
          </a>{" "}
          for free
        </p>
      </div>
    </div>
  );
}
