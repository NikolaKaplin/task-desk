import Chat from "@/components/shared/chat";
import { Brain } from "lucide-react";

export default function Home() {
  return (
    <main className="flex  min-h-screen flex-col items-center justify-center  bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold  text-gray-800 dark:text-gray-200">
        <div className="flex items-center text-4xl gap-3 font-bold">
          Altergemu AI tools <Brain size={60} />
        </div>
      </h1>
      <div className="w-full max-w-4xl">
        <Chat />
      </div>
    </main>
  );
}
