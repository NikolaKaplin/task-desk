"use client";
import Chat from "@/components/shared/chat";
import ModelViewer from "@/components/shared/model-viewer";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [chatType, setChatType] = useState("text");
  useEffect(() => {}, [chatType]);
  return (
    <main className="flex  min-h-screen flex-col items-center justify-center  bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold  text-gray-800 dark:text-gray-200">
        <div className="flex items-center text-4xl gap-3 font-bold">
          Altergemu AI tools <Brain size={60} />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setChatType("text")}>TEXT AI</Button>
          <Button onClick={() => setChatType("image")}>3D AI</Button>
        </div>
      </h1>
      <div className="w-full max-w-4xl">
        {chatType === "text" ? <Chat /> : <ModelViewer />}
      </div>
    </main>
  );
}
