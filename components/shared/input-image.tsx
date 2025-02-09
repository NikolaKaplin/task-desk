"use client";

import { useState, useRef } from "react";
import { Input } from "../ui/input";
import { CloudUpload } from "lucide-react";
import { Button } from "../ui/button";
import type React from "react"; // Added import for React
import { useToast } from "@/hooks/use-toast";

export const InputImage = (props: {
  onChange: (url: string) => void;
  userId: string;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.item(0);
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const res = await fetch(`/api/update-avatar/${props.userId}`, {
        method: "POST",
        headers: {
          "Content-Type": file.type,
        },
        body: Buffer.from(await file.arrayBuffer()),
      });

      if (res.status == 200) {
        toast({
          title: "Успешно",
          description: "Аватар успешно обновлен",
        });
      }

      const obj = await res.json();
      if (!obj.url) {
        throw new Error("No URL returned from server");
      }
      props.onChange(obj.url);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update avatar",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        variant="outline"
        size="icon"
        className="w-12 min-h-12 text-green-500 border-none rounded-full transition-transform hover:translate-y-[-9px] bg-transparent hover:bg-transparent"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <CloudUpload
          className={`min-w-12 min-h-12 text-green-400 ${
            isUploading ? "animate-pulse" : ""
          }`}
        />
      </Button>
      <Input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      {isUploading && (
        <p className="mt-2 text-sm text-gray-400">Uploading...</p>
      )}
    </div>
  );
};
