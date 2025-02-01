"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { getUserSession } from "@/lib/get-session-server"

export function AwaitingVerification() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    const checkUserStatus = async () => {
      if (isChecking) return
      setIsChecking(true)

      try {
        const user = await getUserSession()
        if (user && user.role === "USER") {
          router.push("/")
        }
        if (!user) {
          router.push("/login")
        }
      } catch (error) {
        router.push("/login")
      } finally {
        setIsChecking(false)
      }
    }
    const intervalId = setInterval(checkUserStatus, 7000) // Check every 7 seconds

    return () => clearInterval(intervalId)
  }, [router, isChecking])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tl from-gray-900 via-green-800 to-gray-900 p-4">
      <div className="bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/000/290/610/small/10__2850_29.jpg"
          alt="Ожидание подтверждения администратора"
          className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-green-500"
        />
        <h1 className="text-2xl font-bold text-green-400 mb-4">Ожидание подтверждения</h1>
        <p className="text-gray-300 mb-6">
          Ваша регистрация успешно завершена. Пожалуйста, подождите, пока администратор подтвердит ваш аккаунт.
        </p>
        <div className="flex items-center justify-center text-green-400">
          <Loader2 className="animate-spin mr-2" size={24} />
          <span>Ожидание подтверждения...</span>
        </div>
      </div>
    </div>
  )
}

