"use client";

import React, { Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import type * as THREE from "three";

import {
  CircleFadingPlusIcon as CircleFadingArrowUp,
  Download,
  LoaderCircle,
} from "lucide-react";
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
      <meshStandardMaterial color="#4ade80" />
    </mesh>
  );
}

export default function ModelViewer() {
  const [modelUrls, setModelUrls] = useState<string[]>([
    "https://cdn-luma.com/blender_convert/114128e1-b8a3-4d62-b6e6-e020c7ec8801/a6d925ab6a96_39312cfca241_iridescent_small_al.glb",
  ]);
  const [error, setError] = useState<string | null>(null);
  const [background, setBackground] = useState<string>("sunset");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeModelIndex, setActiveModelIndex] = useState(0);

  const handleDownload = () => {
    if (modelUrls[activeModelIndex]) {
      const link = document.createElement("a");
      link.href = modelUrls[activeModelIndex];
      link.download = `3d-model-${activeModelIndex + 1}.glb`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleBackgroundChange = (newBackground: string) => {
    setBackground(newBackground);
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
      const promises = dataUids.response.map(async (uid: string) => {
        return new Promise<string>((resolve, reject) => {
          const timeout = setInterval(async () => {
            const result = await fetch(
              `https://webapp.engineeringlumalabs.com/api/v3/creations/uuid/${uid}`
            ).then((response) => response.json());
            if (result.response.status === "completed") {
              const model = result.response.output.filter(
                (item: any) => item.metadata.file_extension === ".glb"
              )[1].file_url;
              resolve(model);
              clearInterval(timeout);
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
    <div className="w-full flex flex-col lg:flex-row gap-4">
      <PromptPanel onGenerate={handleGenerate} />
      <div className="flex-grow relative h-[400px] sm:h-[500px] lg:h-[800px]">
        <Canvas className="rounded-3xl h-full" camera={{ position: [0, 1, 1] }}>
          <Suspense fallback={<LoadingSpinner />}>
            <ambientLight intensity={3} />
            <hemisphereLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            {modelUrls[activeModelIndex] && (
              <Model url={modelUrls[activeModelIndex]} />
            )}
            <OrbitControls />
            <Environment preset={background as any} background />
          </Suspense>
        </Canvas>
        <div className="absolute bottom-16 left-2 sm:left-4 flex gap-2">
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded text-xs sm:text-sm lg:text-base flex items-center gap-1 sm:gap-2">
            Улучшить <CircleFadingArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex gap-1 sm:gap-2">
          <Button
            onClick={() => handleBackgroundChange("sunset")}
            className="bg-gray-700 hover:bg-gray-600 text-green-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded text-xs sm:text-sm lg:text-base"
          >
            Утро
          </Button>
          <Button
            onClick={() => handleBackgroundChange("dawn")}
            className="bg-gray-700 hover:bg-gray-600 text-green-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded text-xs sm:text-sm lg:text-base"
          >
            День
          </Button>
          <Button
            onClick={() => handleBackgroundChange("night")}
            className="bg-gray-700 hover:bg-gray-600 text-green-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded text-xs sm:text-sm lg:text-base"
          >
            Ночь
          </Button>
        </div>
        {modelUrls.length > 0 && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex gap-1 sm:gap-2">
            {modelUrls.map((_, index) => (
              <Button
                key={index}
                onClick={() => setActiveModelIndex(index)}
                className={`${
                  activeModelIndex === index
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-700 text-green-400"
                } hover:bg-indigo-700 hover:text-white font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full text-xs sm:text-sm lg:text-base`}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        )}
        {modelUrls.length > 0 && (
          <Button
            onClick={handleDownload}
            className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-gray-700 hover:bg-gray-600 text-green-400 font-bold py-1 px-2 sm:py-2 sm:px-4 rounded"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        )}
        {isGenerating && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 rounded-[25px] flex flex-col items-center justify-center">
            <div className="text-green-400 text-xl sm:text-2xl lg:text-3xl font-bold mb-4 animate-pulse">
              Генерация...
            </div>
            <LoaderCircle size={32} className="animate-spin text-green-400" />
          </div>
        )}
      </div>
    </div>
  );
}
