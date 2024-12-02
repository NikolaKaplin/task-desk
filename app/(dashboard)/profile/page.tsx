import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUserSession } from "@/lib/get-session-server";
import { useState } from "react";
import { ProfileForm } from "@/components/shared/forms/profile/form-profile";

export default async function Home() {
  const user = await getUserSession();
  return (
    <div className=" flex flex-wrap content-center bg-gradient-to-tl from-zinc-900 via-violet-600 to-indigo-600 min-h-screen min-w-screen justify-center bg-cover ">
      <div className="  flex gap-10 rounded-3xl min-h-max w-11/12 p-5  ">
        <div className="  bg-white min-h-content w-5/12 rounded-2xl">
          <Avatar className=" text-black">
            <AvatarImage
              className=" rounded-full m-auto p-2"
              src="https://github.com/shadcn.png"
            />
          </Avatar>
          <div className="grid gap-3 p-5">
            <div className="flex justify-between">
              <div>
                {" "}
                <h1>First Name</h1>
                <Input
                  size={20}
                  className="min-h-10"
                  placeholder="firstname"
                  defaultValue={user?.firstName}
                />
              </div>

              <div>
                {" "}
                <h1>Last Name</h1>
                <label htmlFor="block"></label>
                <Input
                  size={20}
                  className="min-h-10"
                  placeholder="firstname"
                  defaultValue={user?.lastName}
                />
              </div>
            </div>
            <ProfileForm />
            <h1>Email</h1>
            <Input size={20} className="min-h-10" placeholder="email" />
            <h1>About</h1>
            <Textarea className=" resize-none" />
          </div>
        </div>
        <div className="grid gap-2 w-7/12">
          <div className="bg-white p-5 rounded-2xl">dfe</div>
          <div className="bg-white p-5 rounded-2xl">fef</div>
        </div>
      </div>
    </div>
  );
}
