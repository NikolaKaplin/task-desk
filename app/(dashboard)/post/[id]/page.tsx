"use client"

import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { getPostById, getUserInfoById } from "@/app/actions"
import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { ru } from "date-fns/locale"
interface Post {
  title: string
  description: string
  authorId: number
  createdAt: string
  contentBlocks: Array<{
    type: string
    content: string
  }>
  video?: string
}

interface Author {
  firstName: string
  lastName: string
  avatar: string
}

export default function PostPage() {
  const [post, setPost] = useState<Post | null>(null)
  const [author, setAuthor] = useState<Author | null>(null)
  const pathname = usePathname()
  const postId = pathname?.split("/").pop()

  useEffect(() => {
    async function fetchPost() {
      if (postId) {
        const fetchedPost = await getPostById(Number(postId))
        if (fetchedPost) {
          const parsedPost = JSON.parse(fetchedPost.content)
          setPost(parsedPost)
          const authorData = await getUserInfoById(Number(fetchedPost.authorId))
          setAuthor(authorData)
        }
      }
    }
    fetchPost()
  }, [postId])

  if (!post || !author) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-400 mb-4">{post.title}</h1>
          <p className="text-xl text-gray-300 mb-6">{post.description}</p>
          <div className="flex items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage src={author.avatar} alt={`${author.firstName} ${author.lastName}`} />
              <AvatarFallback>
                {author.firstName[0]}
                {author.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <p className="text-lg font-medium text-gray-200">
                {author.firstName} {author.lastName}
              </p>
              <p className="text-sm text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: ru })}
              </p>
            </div>
          </div>
        </header>
        <div className="space-y-8">
          {post.contentBlocks.map((block, index) => (
            <div key={index}>
              {block.type === "text" ? (
                <p className="text-gray-300 text-lg leading-relaxed">{block.content}</p>
              ) : (
                <div className="relative h-64 sm:h-96 w-full rounded-lg overflow-hidden">
                  <img
                    src={block.content || "/placeholder.svg"}
                    alt="Post image"
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
            </div>
          ))}
          {post.video && (
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <video src={post.video} controls className="w-full h-full object-cover">
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-12 w-3/4 bg-gray-600 animate-pulse" />
        <Skeleton className="h-6 w-full bg-gray-600 animate-pulse" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full bg-gray-600 animate-pulse" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 bg-gray-600 animate-pulse" />
            <Skeleton className="h-3 w-24 bg-gray-600 animate-pulse" />
          </div>
        </div>
        <Skeleton className="h-64 w-full bg-gray-600 animate-pulse" />
        <Skeleton className="h-4 w-full bg-gray-600 animate-pulse" />
        <Skeleton className="h-4 w-5/6 bg-gray-600 animate-pulse" />
        <Skeleton className="h-4 w-4/6 bg-gray-600 animate-pulse" />
      </div>
    </div>
  )
}

