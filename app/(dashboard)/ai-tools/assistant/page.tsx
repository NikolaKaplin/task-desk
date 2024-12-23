"use client";
import Chat from "@/components/shared/chat";
import ModelViewer from "@/components/shared/model-viewer";
import { Button } from "@/components/ui/button";
import { BotMessageSquare, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex  min-h-screen flex-col items-center justify-center  bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl mb-4">
        <span className="flex items-center gap-3">
          Чат с AI <BotMessageSquare size={60} />
        </span>
      </h1>
      <div className="w-full max-w-4xl">
        <Chat />
      </div>
    </main>
  );
}
