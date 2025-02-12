"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, SendHorizonal } from "lucide-react"
import CopyButton from "./copy-button"

interface Message {
  role: string
  content: string
  timestamp: number
}

const STORAGE_KEY = "chatMessages"

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const storedMessages = localStorage.getItem(STORAGE_KEY)
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages))
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    }
  }, [messages, mounted])

  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chat-container")
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }

  useEffect(scrollToBottom, []) //Fixed unnecessary dependency

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: input }),
      })

      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let aiResponse = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        aiResponse += chunk
        setMessages((prev) => {
          const newMessages = [...prev]
          if (newMessages[newMessages.length - 1].role === "assistant") {
            newMessages[newMessages.length - 1].content = aiResponse
          } else {
            newMessages.push({
              role: "assistant",
              content: aiResponse,
              timestamp: Date.now(),
            })
          }
          return [...newMessages]
        })
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, an error occurred.",
          timestamp: Date.now(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <Card className="w-full mx-auto bg-gray-800 shadow-lg border-gray-700">
      <CardContent className="p-2 sm:p-4 md:p-6">
        <div
          id="chat-container"
          className="h-[calc(100vh-200px)] sm:h-[calc(100vh-250px)] md:h-[calc(100vh-300px)] overflow-y-auto pr-2 md:pr-4 mb-2 sm:mb-4 pb-2 sm:pb-4"
        >
          {messages.map((m, index) => (
            <div key={index} className={`mb-2 sm:mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block p-2 sm:p-3 rounded-lg max-w-[90%] sm:max-w-[80%] md:max-w-[70%] ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                    : "bg-gray-700 text-green-400"
                }`}
              >
                <ReactMarkdown
                  rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "")
                      return !inline && match ? (
                        <div className="relative">
                          <SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                          <CopyButton text={String(children)} />
                        </div>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    },
                  }}
                >
                  {m.content}
                </ReactMarkdown>
                <div className="text-xs text-gray-400 mt-1">{new Date(m.timestamp).toLocaleString()}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-2 sm:mt-4 flex justify-between">
          <Button variant="destructive" size="sm" onClick={clearChat} className="text-xs">
            Clear Chat
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToBottom}
            className="text-xs rounded-full h-8 w-8 bg-gray-700 hover:bg-gray-600"
          >
            <ChevronDown className="text-green-400" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="mt-2 sm:mt-4 flex">
          <Input
            className="flex-grow mr-2 bg-gray-700 text-green-400 border-gray-600 text-sm sm:text-base"
            value={input}
            placeholder="Введите сообщение..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <SendHorizonal className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

