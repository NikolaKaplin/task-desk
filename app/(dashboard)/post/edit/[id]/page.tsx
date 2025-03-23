"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { Video, LoaderCircle } from "lucide-react";
import { getUserSession } from "@/lib/get-session-server";
import { getPostById, updatePost } from "@/app/actions";
import axios from "axios";

export default function EditPost() {
  const [user, setUser] = useState(null);
  const [post, setPost] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [name, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const editorInstanceRef = useRef<any>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams();
  const postId = params.id;

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .codex-editor, .ce-block, .ce-paragraph, .ce-header, .cdx-quote, .cdx-checklist__item-text, .cdx-list__item, .ce-code__textarea, .cdx-input, .cdx-attaches__title, .cdx-attaches__description, .cdx-attaches__size, .cdx-warning__title, .cdx-warning__message {
        color: white !important;
      }
      .codex-editor ::placeholder {
        color: rgba(255, 255, 255, 0.5) !important;
      }
      .ce-toolbar__plus, .ce-toolbar__settings-btn {
        color: white !important;
        background-color: rgba(50, 50, 50, 0.7) !important;
      }
      .ce-popover {
        background-color: #2d3748 !important;
        border-color: #4a5568 !important;
      }
      .ce-popover__item-icon, .ce-popover__item-label {
        color: white !important;
      }
      .ce-popover__item:hover {
        background-color: #4a5568 !important;
      }
      .cdx-marker {
        background: rgba(45, 170, 219, 0.3) !important;
      }
      .cdx-checklist__item--checked .cdx-checklist__item-text {
        text-decoration: line-through;
        color: rgba(255, 255, 255, 0.5) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch post data
  useEffect(() => {
    async function fetchPostData() {
      if (!postId) return;

      try {
        setIsLoading(true);
        const fetchedPost = await getPostById(postId as string);

        if (!fetchedPost) {
          setError("Пост не найден");
          return;
        }

        const parsedContent = JSON.parse(fetchedPost.content);
        setPost(fetchedPost);
        setTitle(parsedContent.name || "");
        setDescription(parsedContent.description || "");

        if (parsedContent.video) {
          setVideoUrl(parsedContent.video);
        }

        const currentUser = await getUserSession();
        setUser(currentUser);

        if (
          currentUser.id !== fetchedPost.authorId &&
          currentUser.role !== "ADMIN"
        ) {
          setError("У вас нет прав на редактирование этого поста");
          router.push("/");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Ошибка при загрузке поста");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPostData();
  }, [postId, router]);

  useEffect(() => {
    if (isLoading || !post) return;

    let editor: any = null;

    const initEditor = async () => {
      try {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const NestedList = (await import("@editorjs/nested-list")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;
        const ImageTool = (await import("@editorjs/image")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const Table = (await import("@editorjs/table")).default;
        const Delimiter = (await import("@editorjs/delimiter")).default;
        const Warning = (await import("@editorjs/warning")).default;
        const Code = (await import("@editorjs/code")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;

        const parsedContent = JSON.parse(post.content);

        editor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: {
              class: Header,
              inlineToolbar: true,
              config: {
                levels: [1, 2, 3, 4, 5, 6],
                defaultLevel: 2,
              },
            },
            paragraph: {
              class: Paragraph,
              inlineToolbar: true,
            },
            list: {
              class: NestedList,
              inlineToolbar: true,
              config: {
                defaultStyle: "unordered",
              },
            },
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  uploadByFile: async (file: File) => {
                    try {
                      const res = await fetch(
                        `/api/upload-image-post/${postId}`,
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": file.type,
                          },
                          body: file,
                        }
                      );

                      if (!res.ok) {
                        throw new Error("Failed to upload image");
                      }

                      const data = await res.json();
                      return {
                        success: 1,
                        file: {
                          url: data.url,
                        },
                      };
                    } catch (error) {
                      console.error("Error uploading image:", error);
                      return {
                        success: 0,
                        file: {
                          url: "",
                        },
                      };
                    }
                  },
                },
              },
            },
            quote: {
              class: Quote,
              inlineToolbar: true,
              config: {
                quotePlaceholder: "Введите цита��у",
                captionPlaceholder: "Автор цитаты",
              },
            },
            table: {
              class: Table,
              inlineToolbar: true,
              config: {
                rows: 2,
                cols: 3,
              },
            },
            delimiter: Delimiter,
            warning: {
              class: Warning,
              inlineToolbar: true,
              config: {
                titlePlaceholder: "Заголовок",
                messagePlaceholder: "Сообщение",
              },
            },
            code: {
              class: Code,
              config: {
                placeholder: "Введите код",
              },
            },
            inlineCode: {
              class: InlineCode,
              shortcut: "CMD+SHIFT+C",
            },
          },
          data: parsedContent.content || { blocks: [] }, // Load existing content
          placeholder: "Начните писать ваш пост здесь...",
          autofocus: true,
          onReady: () => {
            console.log("Editor.js is ready to work!");
            setEditorInitialized(true);
          },
        });

        editorInstanceRef.current = editor;
      } catch (error) {
        console.error("Editor initialization failed:", error);
      }
    };

    initEditor();

    return () => {
      if (editorInstanceRef.current) {
        try {
          editorInstanceRef.current.isReady
            .then(() => {
              console.log("Destroying editor...");
              editorInstanceRef.current.destroy();
              editorInstanceRef.current = null;
            })
            .catch((e: any) => {
              console.error("ERROR destroying editor", e);
            });
        } catch (err) {
          console.error("ERROR cleaning up editor", err);
        }
      }
    };
  }, [isLoading, post, postId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);

    try {
      if (!editorInstanceRef.current) {
        throw new Error("Editor not initialized");
      }

      const editorData = await editorInstanceRef.current.save();

      const postData = {
        name,
        description,
        author: user.id,
        content: editorData,
        video: videoUrl ? videoUrl : null,
        createdAt: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(postData, null, 2);

      const updateData = {
        id: postId,
        name,
        content: jsonString,
      };

      await updatePost(updateData);
      router.push(`/post/${postId}`);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 flex items-center justify-center">
        <LoaderCircle className="w-12 h-12 animate-spin text-green-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 flex flex-col items-center justify-center">
        <div className="text-red-400 text-xl mb-4">{error}</div>
        <Button
          onClick={() => router.push("/")}
          className="bg-green-500 hover:bg-green-600"
        >
          Вернуться на главную
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-400">
            Редактировать пост
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
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

            <div>
              <Label className="text-gray-300 mb-2 block">Содержание</Label>
              <div
                id="editorjs"
                className="bg-gray-700 rounded-md p-4 min-h-[300px]"
              />
            </div>

            <div>
              <Label htmlFor="video" className="text-gray-300">
                Видео
              </Label>
              {videoUrl && (
                <div className="mb-4 p-2 bg-gray-700 rounded-md">
                  <p className="text-sm text-gray-300 mb-2">Текущее видео:</p>
                  <div className="aspect-video rounded-md overflow-hidden">
                    <video controls className="w-full h-full">
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
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
                  <Video className="mr-2 h-4 w-4" />{" "}
                  {videoUrl ? "Заменить видео" : "Выбрать видео"}
                </Button>
                <Button
                  type="button"
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
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-gray-700 hover:bg-gray-600 text-white"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                "Сохранить изменения"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
