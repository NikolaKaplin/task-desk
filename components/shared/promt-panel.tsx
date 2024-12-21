import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PromptPanelProps {
  onGenerate: (prompt: string) => void;
}

export function PromptPanel({ onGenerate }: PromptPanelProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };

  return (
    <div className="w-64 bg-gray-100 p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Generate 3D Model</h2>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the 3D model you want to generate..."
          className="w-full mb-4"
          rows={4}
        />
        <Button type="submit" className="w-full">
          Generate
        </Button>
      </form>
      <div className="mt-4">
        <h3 className="text-md font-semibold mb-2">Recent Prompts:</h3>
        <ul className="list-disc pl-5">
          <li>A futuristic spaceship</li>
          <li>A medieval castle</li>
          <li>An underwater coral reef</li>
        </ul>
      </div>
    </div>
  );
}
