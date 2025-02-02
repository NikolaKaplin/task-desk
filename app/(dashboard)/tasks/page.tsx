"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

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
<div className="flex items-center space-x-2">
      <Switch type="button" id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  )
}

