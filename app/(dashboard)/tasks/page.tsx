"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("Отправка...")
    setError("")

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("Сообщение отправлено!")
        setMessage("")
      } else {
        setStatus("Ошибка при отправке")
        setError(`Ошибка: ${data.error}. Chat ID: ${data.chatId}`)
      }
    } catch (error) {
      setStatus("Ошибка при отправке")
      setError(`Неизвестная ошибка: ${error}`)
      console.error("Error:", error)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Отправить сообщение в Telegram</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите ваше сообщение"
              required
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <Button type="submit">Отправить</Button>
            {status && <p className="text-sm text-gray-500 mt-2">{status}</p>}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

