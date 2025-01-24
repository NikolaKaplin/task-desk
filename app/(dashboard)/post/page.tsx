"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, Video, Plus, X } from "lucide-react"
import Image from "next/image"
import { getUserSession } from "@/lib/get-session-server"
import { postCreate } from "@/app/actions"

type ContentBlock = {
  type: "text" | "image"
  content: string
}

export default function CreatePost() {
  const [user, setUser] = useState()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([{ type: "text", content: "" }])
  const [video, setVideo] = useState<File | null>(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      const user = await getUserSession()
      if (user) {
        setUser(user)
      }
    })()
  }, [])

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      try {
        const res = await fetch(`/api/upload-image-post/${new Date().toISOString()}`, {
          method: "POST",
          headers: {
            "Content-Type": file.type,
          },
          body: file,
        })

        if (!res.ok) {
          throw new Error("Failed to upload image")
        }

        const data = await res.json()
        const imageUrl = data.url

        setContentBlocks((prevBlocks) => {
          const newBlocks = [...prevBlocks]
          newBlocks.splice(index + 1, 0, { type: "image", content: imageUrl })
          return newBlocks
        })
      } catch (error) {
        console.error("Error uploading image:", error)
        // You might want to show an error message to the user here
      }
    }
  }, [])

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0])
    }
  }

  const handleContentChange = (index: number, value: string) => {
    const newBlocks = [...contentBlocks]
    newBlocks[index].content = value
    setContentBlocks(newBlocks)
  }

  const addTextBlock = (index: number) => {
    const newBlocks = [...contentBlocks]
    newBlocks.splice(index + 1, 0, { type: "text", content: "" })
    setContentBlocks(newBlocks)
  }

  const removeBlock = (index: number) => {
    const newBlocks = [...contentBlocks]
    newBlocks.splice(index, 1)
    setContentBlocks(newBlocks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(user)
    e.preventDefault()
    setIsPublishing(true)
    try {
      // Создаем объект с данными поста
      const postData = {
        title,
        description,
        author: user.id,
        contentBlocks,
        video: video ? video.name : null,
        createdAt: new Date().toISOString(),
      }

      // Преобразуем объект в JSON строку
      const jsonString = JSON.stringify(postData, null, 2)

      const DbData = {
        title,
        userId: Number(user.id),
        content: jsonString,
      }

      postCreate(DbData)

      //   const blob = new Blob([jsonString], { type: 'application/json' })

      //   const url = URL.createObjectURL(blob)

      //   const link = document.createElement('a')
      //   link.href = url
      //   link.download = `post_${Date.now()}.json`

      //   document.body.appendChild(link)
      //   link.click()
      //   document.body.removeChild(link)

      //   URL.revokeObjectURL(url)

      //   console.log('Post data saved to JSON file')
      router.push("/")
    } catch (error) {
      console.error("Error publishing post:", error)
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <Card className="max-w-2xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-400">Создать новый пост</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-gray-300">
                Заголовок
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 bg-gray-700 text-white"
                required
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-gray-300">
                Описание
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 bg-gray-700 text-white"
                rows={3}
                required
              />
            </div>
            {contentBlocks.map((block, index) => (
              <div key={index} className="space-y-2">
                {block.type === "text" ? (
                  <Textarea
                    value={block.content}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    className="mt-1 bg-gray-700 text-white"
                    rows={3}
                  />
                ) : (
                  <div className="relative">
                    <img
                      src={block.content || "/placeholder.svg"}
                      alt="Uploaded image"
                      width={500}
                      height={300}
                      className="rounded-lg"
                    />
                    <Button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    onClick={() => addTextBlock(index)}
                    className="bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Добавить текст
                  </Button>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="hidden"
                      ref={imageInputRef}
                    />
                    <Button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="bg-gray-700 hover:bg-gray-600 text-white"
                    >
                      <Upload className="mr-2 h-4 w-4" /> Добавить изображение
                    </Button>
                  </div>
                  {index > 0 && (
                    <Button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <X className="mr-2 h-4 w-4" /> Удалить блок
                    </Button>
                  )}
                </div>
              </div>
            ))}
            <div>
              <Label htmlFor="video" className="text-gray-300">
                Видео
              </Label>
              <div className="flex items-center mt-1">
                <Input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  ref={videoInputRef}
                />
                <Button
                  type="button"
                  onClick={() => videoInputRef.current?.click()}
                  className="bg-gray-700 hover:bg-gray-600 text-white"
                >
                  <Video className="mr-2 h-4 w-4" /> Загрузить видео
                </Button>
                {video && <span className="ml-2 text-gray-300">{video.name}</span>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white" disabled={isPublishing}>
              {isPublishing ? "Публикация..." : "Опубликовать"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

