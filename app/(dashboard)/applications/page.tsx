import { Check, Handshake, Plus, X } from "lucide-react";
import { Applications, confirmUser } from "../../actions";
import { Prisma } from "@prisma/client";
import React, { use } from "react";
import { ButtonApprove } from "@/components/shared/buttonApprove";
import { useRouter } from "next/router";
import { getUserSession } from "@/lib/get-session-server";

export default async function Home() {
  const user = await getUserSession();
  if (user?.role != "ADMIN") return null;
  const applications = await Applications();
  console.log({ applications });
  return (
    <div className=" bg-stone-900 px-5 pt-2 min-h-screen min-w-screen">
      <div className=" text-white text-3xl  text-center items-center">
        К регистрации:
      </div>
      <div className="flex flex-col gap-5 pt-3">
        {applications!.map((a) => (
          <div
            key={a.id}
            className="flex  gap-5 bg-white  items-center p-2 rounded-2xl "
          >
            <div className="w-1/6">{a.firstName + " " + a.lastName}</div>
            <div className="w-2/6">{a.email}</div>
            <div className="w-6/12">{a.updatedAt.toString()}</div>
            <div className="flex justify-end gap-5">
              <ButtonApprove a={a} isDelete={false} icon={<Check />} />
              <ButtonApprove a={a} isDelete={true} icon={<X />} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
