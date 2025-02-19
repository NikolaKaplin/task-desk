"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Video, Plus, X, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { getUserSession } from "@/lib/get-session-server";
import { getLastPostId, postCreate } from "@/app/actions";
import { number } from "zod";
import { uploadLargeFiles } from "@/utils/awsLargeUpload";
import axios from "axios";

type ContentBlock = {
  type: "text" | "image";
  content: string;
};

export default function CreatePost() {
  const [user, setUser] = useState();
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [name, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([
    { type: "text", content: "" },
  ]);
  const [videoUrl, setVideoUrl] = useState("");
  const [isPublishing, setIsPublishing] = useState(false); // Added state for publishing status
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await getUserSession();
      if (user) {
        setUser(user);
      }
    })();
  }, []);

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        try {
          const postId = await getLastPostId();
          console.log("Post: " + postId);
          const res = await fetch(`/api/upload-image-post/${postId}`, {
            method: "POST",
            headers: {
              "Content-Type": file.type,
            },
            body: file,
          });

          if (!res.ok) {
            throw new Error("Failed to upload image");
          }

          const data = await res.json();
          const imageUrl = data.url;

          setContentBlocks((prevBlocks) => {
            const newBlocks = [...prevBlocks];
            newBlocks.splice(index + 1, 0, {
              type: "image",
              content: imageUrl,
            });
            return newBlocks;
          });
        } catch (error) {
          console.error("Error uploading image:", error);
          // You might want to show an error message to the user here
        }
      }
    },
    []
  );

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploadStatus("uploading");
    setProgress(0);

    try {
      const postId = await getLastPostId();
      const {
        data: { presignedUrl, key },
      } = await axios.post(`/api/getPresignedUrl/${postId}`, {
        filename: file.name,
        contentType: file.type,
      });

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          setProgress(percentCompleted);
        },
      });
      setVideoUrl(key);
      setUploadStatus("success");
      setProgress(100);
      console.log("File uploaded successfully. Object key:", key);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
    }
  };

  const handleContentChange = (index: number, value: string) => {
    const newBlocks = [...contentBlocks];
    newBlocks[index].content = value;
    setContentBlocks(newBlocks);
  };

  const addTextBlock = (index: number) => {
    const newBlocks = [...contentBlocks];
    newBlocks.splice(index + 1, 0, { type: "text", content: "" });
    setContentBlocks(newBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = [...contentBlocks];
    newBlocks.splice(index, 1);
    setContentBlocks(newBlocks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(user);
    e.preventDefault();
    setIsPublishing(true);
    try {
      const postData = {
        name,
        description,
        author: user.id,
        contentBlocks,
        video: videoUrl ? videoUrl : null,
        createdAt: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(postData, null, 2);

      const DbData = {
        name,
        authorId: user.id,
        content: jsonString,
      };

      postCreate(DbData);

      router.push("/");
    } catch (error) {
      console.error("Error publishing post:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <Card className="max-w-2xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-400">
            Создать новый пост
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">
                Заголовок
              </Label>
              <Input
                id="name"
                value={name}
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
              <div className="flex items-center mt-1 space-x-2">
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
                  <Video className="mr-2 h-4 w-4" /> Выбрать видео
                </Button>
                <Button
                  onClick={uploadFile}
                  disabled={
                    !file ||
                    uploadStatus === "uploading" ||
                    uploadStatus === "success"
                  }
                  className={`flex-1 ${
                    uploadStatus === "uploading"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : uploadStatus === "success"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  } text-white transition-colors duration-200`}
                >
                  {uploadStatus === "uploading"
                    ? `Загрузка: ${progress}%`
                    : uploadStatus === "success"
                    ? "Загружено успешно"
                    : "Загрузить"}
                </Button>
              </div>
              {uploadStatus === "success" && (
                <div className="mt-2 p-2 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Файл успешно загружен!
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={isPublishing}
            >
              {isPublishing ? "Публикация..." : "Опубликовать"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
