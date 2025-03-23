"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
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
import { Video, LoaderCircle, ShieldCheck } from "lucide-react";
import { getUserSession } from "@/lib/get-session-server";
import { getLastPostId, postCreate } from "@/app/actions";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreatePost() {
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [name, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [editorInitialized, setEditorInitialized] = useState(false);
  const [postStatus, setPostStatus] = useState<
    "EXPECTATION" | "APPROVED" | "RN"
  >("EXPECTATION");

  const editorInstanceRef = useRef<any>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
.ce-block--selected .ce-block__content,
.ce-inline-toolbar,
.codex-editor--narrow .ce-toolbox,
.ce-conversion-toolbar,
.ce-settings,
.ce-settings__button,
.ce-toolbar__settings-btn,
.cdx-button,
.ce-popover,
.ce-toolbar__plus:hover {
  background: #007991;
  color: inherit;
}

.ce-inline-tool,
.ce-conversion-toolbar__label,
.ce-toolbox__button,
.cdx-settings-button,
.ce-toolbar__plus {
  color: inherit;
}

::selection {
  background: #439a86;
}

.cdx-settings-button:hover,
.ce-settings__button:hover,
.ce-toolbox__button--active,
.ce-toolbox__button:hover,
.cdx-button:hover,
.ce-inline-toolbar__dropdown:hover,
.ce-inline-tool:hover,
.ce-popover__item:hover,
.ce-toolbar__settings-btn:hover {
  background-color: #439a86;
  color: inherit;
}

.cdx-notify--error {
  background: #fb5d5d !important;
}

.cdx-notify__cross::after,
.cdx-notify__cross::before {
  background: white;
}
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    let editor: any = null;

    const initEditor = async () => {
      try {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const NestedList = (await import("@editorjs/nested-list")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;
        const ImageTool = (await import("@editorjs/image")).default;
        const Quote = (await import("@editorjs/quote")).default;
        const Table = (await import("@editorjs/table")).default;
        const Delimiter = (await import("@editorjs/delimiter")).default;
        const Warning = (await import("@editorjs/warning")).default;
        const Code = (await import("@editorjs/code")).default;
        const InlineCode = (await import("@editorjs/inline-code")).default;

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
                      const postId = await getLastPostId();
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
                quotePlaceholder: "Введите цитату",
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
  }, []);

  useEffect(() => {
    (async () => {
      const user = await getUserSession();
      if (user) {
        setUser(user);
        // Check if user is admin
        setIsAdmin(user.role === "ADMIN");
      }
    })();
  }, []);

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
        status: isAdmin ? postStatus : "EXPECTATION",
      };

      const jsonString = JSON.stringify(postData, null, 2);

      const DbData = {
        name,
        authorId: user.id,
        content: jsonString,
        postStatus: isAdmin ? postStatus : "EXPECTATION",
      };

      await postCreate(DbData);
      router.push("/");
    } catch (error) {
      console.error("Error publishing post:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const statusOptions = [
    { value: "EXPECTATION", label: "На рассмотрении" },
    { value: "APPROVED", label: "Одобрено" },
    { value: "RN", label: "Новая версия" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12">
      <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-400">
            Создать новый пост
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

            {isAdmin && (
              <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="h-5 w-5 text-green-400" />
                  <Label className="text-green-400 font-medium">
                    Настройки администратора
                  </Label>
                </div>
                <div>
                  <Label
                    htmlFor="postStatus"
                    className="text-gray-300 mb-2 block"
                  >
                    Статус публикации
                  </Label>
                  <Select
                    value={postStatus}
                    onValueChange={(value: "EXPECTATION" | "APPROVED" | "RN") =>
                      setPostStatus(value)
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white w-full">
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      {statusOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="text-white hover:bg-gray-600"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="mt-2 text-sm text-gray-400">
                    {postStatus === "EXPECTATION" &&
                      "Пост будет ожидать проверки модератором"}
                    {postStatus === "APPROVED" &&
                      "Пост будет сразу опубликован"}
                    {postStatus === "RN" && "Новая версия сайта"}
                  </div>
                </div>
              </div>
            )}

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
          <CardFooter>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white"
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Публикация...
                </>
              ) : (
                "Опубликовать"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
