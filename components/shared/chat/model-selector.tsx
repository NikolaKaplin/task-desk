"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const models = [
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "claude-v1", name: "Claude v1" },
  { id: "claude-instant-v1", name: "Claude Instant v1" },
]

export default function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState(models[0].id)

  return (
    <div className="mb-2 sm:mb-4">
      <Select value={selectedModel} onValueChange={setSelectedModel}>
        <SelectTrigger className="w-full bg-gray-700 text-green-400 border-gray-600 text-sm sm:text-base">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          {models.map((model) => (
            <SelectItem
              key={model.id}
              value={model.id}
              className="text-green-400 hover:bg-gray-600 text-sm sm:text-base"
            >
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

