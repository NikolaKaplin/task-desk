import { AwaitingVerification } from "@/components/shared/awaitingVerification"
import { getUserSession } from "@/lib/get-session-server"
import { redirect } from "next/navigation"


export default async function Register() {
  const user = await getUserSession()

  if (!user) redirect("/login")
  if (user.role === "USER") redirect("/")

  return <AwaitingVerification />
}

