"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PendingPostCardProps {
  post: any // Replace 'any' with your actual Post type
  author: any // Replace 'any' with your actual User type
  onApprove: (postId: string) => Promise<void>
  onReject: (postId: string) => Promise<void>
}

export function PendingPostCard({ post, author, onApprove, onReject }: PendingPostCardProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleApprove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await onApprove(post.id)
    setIsVisible(false)
  }

  const handleReject = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await onReject(post.id)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <Link href={`/post/${post.id}`}>
      <Card className="bg-gray-800 border-yellow-400 border hover:bg-gray-700 transition-colors">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-xl text-yellow-400">{post.name}</span>
            <Badge variant="outline" className="bg-yellow-400/10 text-yellow-400">
              На рассмотрении
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={author.avatar} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Автор</p>
              <p className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <p className="text-gray-300 mb-4">{post.description}</p>
          {JSON.parse(post.content).video && (
            <div className="relative h-48 mb-4">
              <Video className="absolute inset-0 w-full h-full object-cover rounded-lg" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="destructive" onClick={handleReject}>
            Отклонить
          </Button>
          <Button variant="default" className="bg-green-500 hover:bg-green-600" onClick={handleApprove}>
            Одобрить
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}

