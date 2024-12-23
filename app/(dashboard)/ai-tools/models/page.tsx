import ModelViewer from "@/components/shared/model-viewer";
import { Box } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl lg:text-4xl mb-4 text-center">
        <span className="flex items-center gap-3 flex-wrap justify-center">
          Генерация 3D моделей{" "}
          <Box size={40} className="lg:w-[60px] lg:h-[60px]" />
        </span>
      </h1>
      <ModelViewer />
    </main>
  );
}
