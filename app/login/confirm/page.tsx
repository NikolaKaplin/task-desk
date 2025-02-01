import { AwaitingVerification } from "@/components/shared/awaitingVerification"
import { getUserSession } from "@/lib/get-session-server"
import { redirect } from "next/navigation"


export default async function Register() {

  return <AwaitingVerification />
}

