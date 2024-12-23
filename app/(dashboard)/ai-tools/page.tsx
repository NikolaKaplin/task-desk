"use client";
import Chat from "@/components/shared/chat";
import ModelViewer from "@/components/shared/model-viewer";
import { Button } from "@/components/ui/button";
import { Bot, Box, Brain } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex  min-h-screen flex-col items-center justify-center  bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold  text-gray-800 dark:text-gray-200">
        <div className="flex items-center text-4xl gap-3 font-bold">
          Altergemu AI tools <Brain size={60} />
        </div>
      </h1>
      <div className="flex  items-center gap-3 mt-6">
        <Button
          title="Чат с AI"
          variant={"outline"}
          onClick={() => router.push("/ai-tools/assistant")}
        >
          <Bot />
        </Button>
        <Button
          title="Генератор моделей"
          variant="outline"
          onClick={() => router.push("/ai-tools/models")}
        >
          <Box />
        </Button>
      </div>
    </main>
  );
}
