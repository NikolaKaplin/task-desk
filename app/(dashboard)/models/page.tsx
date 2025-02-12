"use client"

import ModelViewer from "@/components/shared/model-viewer"
import { Box } from "lucide-react"

export default function Models() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-2 sm:p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl mb-4 text-center text-green-400 mt-2 sm:mt-4">
        <span className="flex items-center gap-3 flex-wrap justify-center">
          Генерация 3D моделей{" "}
          <Box size={32} className="sm:w-[40px] sm:h-[40px] lg:w-[60px] lg:h-[60px] text-green-400" />
        </span>
      </h1>
      <ModelViewer />
    </main>
  )
}

