"use client"


import Chat from "@/components/shared/chat/chat"
import ModelSelector from "@/components/shared/chat/model-selector"
import { BotMessageSquare } from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-2 sm:p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-4 text-green-400 mt-2 sm:mt-4">
        <span className="flex items-center gap-3">
          Чат с AI <BotMessageSquare size={32} className="text-green-400" />
        </span>
      </h1>
      <div className="w-full max-w-3xl">
        <ModelSelector />
        <Chat />
      </div>
    </main>
  )
}

