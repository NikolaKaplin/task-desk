"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PostApprovalButtonsProps {
  postId: string
  onApprove: (postId: string) => Promise<void>
  onReject: (postId: string) => Promise<void>
}

export function PostApprovalButtons({ postId, onApprove, onReject }: PostApprovalButtonsProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleApprove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await onApprove(postId)
    setIsVisible(false)
  }

  const handleReject = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await onReject(postId)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="flex justify-end space-x-2">
      <Button variant="destructive" onClick={handleReject}>
        Отклонить
      </Button>
      <Button variant="default" className="bg-green-500 hover:bg-green-600" onClick={handleApprove}>
        Одобрить
      </Button>
    </div>
  )
}

