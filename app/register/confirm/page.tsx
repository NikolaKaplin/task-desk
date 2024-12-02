import { getUserSession } from "@/lib/get-session-server";
import { redirect } from "next/navigation";

export default async function Register() {
  const user = await getUserSession();
  if (!user) redirect("/login");
  if (user!.role != "UNVERIFIED") redirect("/");

  return (
    <div className=" flex flex-wrap content-center bg-gradient-to-tl from-zinc-900 via-violet-600 to-indigo-600 min-h-screen min-w-screen justify-center bg-cover">
      <img
        src="https://media.istockphoto.com/id/1192884194/vector/admin-sign-on-laptop-icon-stock-vector.jpg?s=170667a&w=0&k=20&c=S274xvXNsp27UyKxzNjhmZEzAb3Zqi2pFOqZjLsZJz0="
        alt="admin"
      />
    </div>
  );
}
