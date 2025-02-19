"use client";

import React, { Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type * as THREE from "three";

import { Download, LoaderCircle } from "lucide-react";
import { PromptPanel } from "./promt-panel";

interface ModelProps {
  url: string;
}

function Model({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function LoadingSpinner() {
  const mesh = React.useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    mesh.current.rotation.y += delta;
  });

  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#818cf8" />
    </mesh>
  );
}

const environmentOptions = [
  "apartment",
  "city",
  "dawn",
  "forest",
  "lobby",
  "night",
  "park",
  "studio",
  "sunset",
  "warehouse",
] as const;

type Environment = (typeof environmentOptions)[number];

export default function ModelViewer() {
  const [modelUrls, setModelUrls] = useState<string[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>(
    Array(4).fill("sunset")
  );
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = (index: number) => {
    if (modelUrls[index]) {
      const link = document.createElement("a");
      link.href = modelUrls[index];
      link.download = `3d-model-${index + 1}.glb`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEnvironmentChange = (index: number, value: Environment) => {
    setEnvironments((prev) => {
      const newEnvironments = [...prev];
      newEnvironments[index] = value;
      return newEnvironments;
    });
  };

  const handleGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/get3dModels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const dataUids = await response.json();
      const MAX_ATTEMPTS = 180;
      const promises = dataUids.response.map(async (uid: string) => {
        return new Promise<string>((resolve, reject) => {
          let attempts = 0;
          const timeout = setInterval(async () => {
            try {
              const response = await fetch(`/api/get3dModels/${uid}`);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const result = await response.json();
              if (result.response.status === "completed") {
                const model = result.response.output.find(
                  (item: any) => item.metadata.file_extension === ".glb"
                )?.file_url;
                if (model) {
                  resolve(model);
                } else {
                  reject(new Error("GLB model not found"));
                }
                clearInterval(timeout);
              } else if (++attempts >= MAX_ATTEMPTS) {
                clearInterval(timeout);
                reject(new Error("Max attempts reached"));
              }
            } catch (error) {
              clearInterval(timeout);
              reject(error);
            }
          }, 1000);
        });
      });
      const models = await Promise.all(promises);
      setModelUrls(models);
    } catch (error) {
      console.error("Error generating models:", error);
      setError(
        `Failed to generate models: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full flex flex-col gap-8 p-4 ">
      <PromptPanel onGenerate={handleGenerate} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="relative">
            <div className="h-[300px] sm:h-[400px] bg-white rounded-xl shadow-lg overflow-hidden">
              <Canvas camera={{ position: [0, 1, 1] }}>
                <Suspense fallback={<LoadingSpinner />}>
                  <ambientLight intensity={3} />
                  <hemisphereLight intensity={0.5} />
                  <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                  />
                  <pointLight position={[-10, -10, -10]} />
                  {modelUrls[index] && <Model url={modelUrls[index]} />}
                  <OrbitControls />
                  <Environment preset={environments[index]} background />
                </Suspense>
              </Canvas>
            </div>
            <Select
              value={environments[index]}
              onValueChange={(value: Environment) =>
                handleEnvironmentChange(index, value)
              }
            >
              <SelectTrigger className="absolute top-4 left-4 w-32 bg-indigo-500 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform bg-opacity-75 backdrop-blur-sm">
                <SelectValue placeholder="Выберите фон" />
              </SelectTrigger>
              <SelectContent className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-35 shadow-md">
                {environmentOptions.map((env) => (
                  <SelectItem
                    className="hover:bg-indigo-600  duration-300 ease-in-out transform"
                    key={env}
                    value={env}
                  >
                    {env}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {modelUrls[index] && (
              <Button
                onClick={() => handleDownload(index)}
                className="absolute bottom-4 right-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
      {isGenerating && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex flex-col items-center justify-center z-50">
          <div className="text-indigo-400 text-2xl sm:text-3xl font-bold mb-4 animate-pulse">
            Генерация...
          </div>
          <LoaderCircle size={48} className="animate-spin text-indigo-400" />
        </div>
      )}
    </div>
  );
}
