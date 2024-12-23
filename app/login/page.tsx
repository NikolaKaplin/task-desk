"use client";
import { LoginForm } from "@/components/shared/forms/login-form";
import { Title } from "@/components/shared/title";
import React from "react";

const Login = () => {
  return (
    <div className="flex flex-wrap content-center bg-gradient-to-tl from-zinc-900 via-violet-600 to-indigo-600 min-h-screen w-full justify-center bg-cover p-4">
      <div className="bg-black rounded-3xl min-h-96 w-full sm:w-4/5 md:w-3/5 lg:w-2/5 p-5 text-white">
        <div>
          <Title
            className="flex text-center text-xl sm:text-2xl"
            size="xl"
            text="Altergemu"
          />
        </div>
        <div className="p-3 sm:p-5 mt-5 text-white bg-neutral-900 w-full rounded-2xl border border-stone-600">
          <LoginForm />
        </div>
        <p className="mt-5 text-sm sm:text-base">
          Don't have an account?{" "}
          <a className="font-bold" href="/register">
            Sign up
          </a>{" "}
          for free
        </p>
      </div>
    </div>
  );
};

export default Login;
