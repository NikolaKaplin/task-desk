import ModelViewer from "@/components/shared/model-viewer";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-4">
      <div className="text-transparent bg-clip-text animate-textflow bg-gradient-to-r from-pink-500 via-yellow-500 to-red-500">
        <h1 className="text-4xl font-bold mb-8 ">MODELS GENERATOR</h1>
      </div>
      <ModelViewer />
    </main>
  );
}
