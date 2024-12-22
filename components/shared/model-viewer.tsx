"use client";

import React, { Suspense, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import { PromptPanel } from "./promt-panel";
import { LoaderCircle } from "lucide-react";
import { set } from "zod";

function Model({ url }: { url: string }) {
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
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

export default function ModelViewer() {
  const [modelUrl, setModelUrl] = useState(
    "https://cdn-luma.com/blender_convert/114128e1-b8a3-4d62-b6e6-e020c7ec8801/a6d925ab6a96_39312cfca241_iridescent_small_al.glb"
  );
  const [error, setError] = useState<string | null>(null);
  const [background, setBackground] = useState<string>("sunset");
  const [isGenerating, setIsGenerating] = useState(false);

  // useEffect(() => {
  //   const fetchModel = async () => {
  //     try {
  //       const response = await fetch(modelUrl);
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }
  //       const blob = await response.blob();
  //       const url = URL.createObjectURL(blob);
  //       setModelUrl(url);
  //     } catch (error) {
  //       console.error("Error fetching model:", error);
  //       setError(
  //         `Failed to fetch model: ${
  //           error instanceof Error ? error.message : String(error)
  //         }`
  //       );
  //     }
  //   };
  //   fetchModel();
  // }, [modelUrl]);

  const handleDownload = () => {
    if (modelUrl) {
      const link = document.createElement("a");
      link.href = modelUrl;
      link.download = "3d-model.glb";
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
    // api для генерации
    const response = await fetch("/api/get3dModels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });
    let dataUids = await response.json();
    const timeout = setInterval(async () => {
      const result = await fetch(
        `https://webapp.engineeringlumalabs.com/api/v3/creations/uuid/${dataUids.response[0]}`
      ).then((response) => response.json());
      if (result.response.status !== "completed") return;
      let model = result.response.output.filter(
        (item: any) => item.metadata.file_extension === ".glb"
      )[0].file_url;
      // обновить url модели
      setModelUrl(model);
      setIsGenerating(false);
      clearInterval(timeout);
    }, 1000);
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full h-[800px] flex gap-4">
      <PromptPanel onGenerate={handleGenerate} />0
      <div className="flex-grow  relative">
        <Canvas className="rounded-3xl" camera={{ position: [0, 1, 1] }}>
          <Suspense fallback={<LoadingSpinner />}>
            <ambientLight intensity={3} />
            <hemisphereLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <pointLight position={[-10, -10, -10]} />
            {modelUrl && <Model url={modelUrl} />}
            <OrbitControls />
            <Environment preset={background as any} background />
          </Suspense>
        </Canvas>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <Button
            onClick={() => handleBackgroundChange("sunset")}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Утро
          </Button>
          <Button
            onClick={() => handleBackgroundChange("dawn")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            День
          </Button>
          <Button
            onClick={() => handleBackgroundChange("night")}
            className="bg-indigo-900 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
          >
            Ночь
          </Button>
        </div>
        {modelUrl && (
          <Button
            onClick={handleDownload}
            className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Скачать
          </Button>
        )}
        {isGenerating && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-white text-2xl">
              Генерация модели{" "}
              <LoaderCircle size={50} className="animate-spin w-full " />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
