import ModelViewer from "@/components/shared/model-viewer";
import { Box } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl mb-4">
        <span className="flex items-center gap-3">
          Генерация 3D моделей <Box size={60} />
        </span>
      </h1>
      <ModelViewer />
    </main>
  );
}
