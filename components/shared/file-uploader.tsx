"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return;

    setUploadStatus("uploading");
    setProgress(0);
    setErrorMessage(null);

    try {
      const {
        data: { presignedUrl, key },
      } = await axios.post("/api/getPresignedUrl", {
        filename: file.name,
        contentType: file.type,
      });

      // Upload to Yandex Cloud Storage
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total!
          );
          console.log(`Upload progress: ${percentCompleted}%`);
          setProgress(percentCompleted);
        },
      });

      setUploadStatus("success");
      console.log("File uploaded successfully. Object key:", key);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("error");
      setErrorMessage(
        error.response?.data?.error ||
          error.message ||
          "An unknown error occurred"
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      <Button
        onClick={uploadFile}
        disabled={!file || uploadStatus === "uploading"}
        className="w-full"
      >
        {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
      </Button>
      {uploadStatus === "uploading" && (
        <Progress value={progress} className="mt-4" />
      )}
      {uploadStatus === "success" && (
        <p className="mt-4 text-green-600">File uploaded successfully!</p>
      )}
      {uploadStatus === "error" && (
        <p className="mt-4 text-red-600">Upload failed: {errorMessage}</p>
      )}
    </div>
  );
}
